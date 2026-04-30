import OpenAI from "openai";
import { NextResponse } from "next/server";
import { buildLocalCommunityAnswer, searchCommunityKnowledge, type CommunitySource } from "@/lib/communityKnowledge";

type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};

type CommunityAssistantRequest = {
  question?: string;
  history?: AssistantMessage[];
};

function sourcesFromKnowledge(question: string): CommunitySource[] {
  return searchCommunityKnowledge(question).map((item) => item.source);
}

function fallbackResponse(question: string) {
  const knowledge = searchCommunityKnowledge(question);

  return {
    answer: buildLocalCommunityAnswer(question, knowledge),
    sources: knowledge.map((item) => item.source),
  };
}

export async function POST(request: Request) {
  let payload: CommunityAssistantRequest;

  try {
    payload = (await request.json()) as CommunityAssistantRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON", message: "请求内容不是合法 JSON。" }, { status: 400 });
  }

  const question = payload.question?.trim();
  if (!question) {
    return NextResponse.json({ error: "Missing question", message: "请先输入问题。" }, { status: 400 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  const knowledge = searchCommunityKnowledge(question);
  const sources = sourcesFromKnowledge(question);

  if (!apiKey) {
    return NextResponse.json(fallbackResponse(question));
  }

  const client = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey,
  });

  const context = knowledge
    .map((item) => {
      return `来源：${item.source.title}\n类型：${item.source.type}\n内容：\n${item.content.map((line) => `- ${line}`).join("\n")}`;
    })
    .join("\n\n");

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "你是 OURchive 的群小记，像一个风趣、耐心、熟悉群历史的社团前辈。你需要基于活动记录、作品归档和群内经验回答问题。回答要具体、有依据，不要编造不存在的活动或作品。如果知识库没有依据，要说明“我不确定，最好问管理员确认”。语气轻松，但不要过度卖萌。回答最后可以给一句鼓励。",
        },
        {
          role: "user",
          content: JSON.stringify({
            question,
            recentHistory: (payload.history ?? []).slice(-6),
            communityKnowledge: context,
          }),
        },
      ],
    });

    const answer = completion.choices[0]?.message?.content?.trim();
    if (!answer) {
      return NextResponse.json(fallbackResponse(question));
    }

    return NextResponse.json({ answer, sources });
  } catch (error) {
    console.error("DeepSeek community assistant failed:", error);
    return NextResponse.json(fallbackResponse(question));
  }
}
