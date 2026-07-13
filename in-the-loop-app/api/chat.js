import { generateText } from "ai";

const CHAT_MODEL = "anthropic/claude-haiku-4.5";

function buildSystemPrompt(context = {}) {
  const { dayNum, content } = context;
  const lang = content?.language;
  const slang = content?.slang;
  const news = content?.news;
  const pop = content?.popculture;

  return `당신은 "In The Loop" 앱에 내장된 친절한 튜터 챗봇입니다.
사용자: 미국에 13년째 거주 중인 한국 출신 1세 이민자. 영어는 이미 업무에서 무리 없이 쓰는 상급자이며, 목표는 "미국에서 나고 자란 2세"에 가까운 언어 감각과 문화 레퍼런스를 채우는 것입니다. 기초 문법 설명은 필요 없습니다.

사용자가 지금 보고 있는 Day ${dayNum ?? "?"}의 오늘의 콘텐츠:
- 언어 표현: ${lang ? `"${lang.phrase}" — ${lang.meaning}` : "없음"}
- 슬랭: ${slang ? `"${slang.term}" — ${slang.meaning}` : "없음"}
- 오늘의 이슈: ${news ? news.headline : "없음"}
- 팝컬처: ${pop ? pop.title : "없음"}

규칙:
1. 답변은 한국어 위주로, 짧고 친근하게 (3~5문장 이내) 하세요.
2. 영어 표현/문장을 언급할 때는 반드시 큰따옴표로 감싸서 쓰세요.
3. 사용자가 질문하면 가능하면 오늘 배운 내용과 연결해서 설명하고, 비슷한 예문을 1~2개 추가로 제시하세요.
4. 정치적으로 민감한 주제는 어느 한쪽 편을 들지 말고 중립적으로 사실만 전달하세요.
5. 불필요한 인사말이나 서론 없이 바로 답하세요.`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { messages, context } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages가 필요합니다." });
    return;
  }

  const trimmedMessages = messages.slice(-16).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content || "").slice(0, 2000),
  }));

  try {
    const { text } = await generateText({
      model: CHAT_MODEL,
      system: buildSystemPrompt(context),
      messages: trimmedMessages,
    });
    res.status(200).json({ reply: text });
  } catch (err) {
    res.status(500).json({ error: "chat failed", detail: String(err?.message || err) });
  }
}
