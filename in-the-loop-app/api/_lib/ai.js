import { gateway, generateObject, generateSpeech } from "ai";
import { z } from "zod";

// Routed through Vercel AI Gateway (OIDC auth once the project is linked and
// AI Gateway is enabled — no manual API key needed on Vercel deployments).
const DAILY_MODEL = "anthropic/claude-sonnet-5";
const QUICK_MODEL = "anthropic/claude-haiku-4.5";
const SPEECH_MODEL = "openai/tts-1-hd";

const dailyContentSchema = z.object({
  language: z.object({
    phrase: z.string().describe("An English idiom/expression a fluent-but-not-native adult professional would still stumble on"),
    meaning: z.string().describe("Korean: literal/dictionary meaning, one short line"),
    nuance: z.string().describe("Korean: how it's actually used, tone, when native speakers reach for it over alternatives"),
    example: z.string().describe("One natural English example sentence"),
    avoidNote: z.string().describe("Korean: a situation where using this would sound off or wrong"),
  }),
  slang: z.object({
    term: z.string().describe("A current or well-established piece of American slang/youth-culture language"),
    meaning: z.string().describe("Korean: what it means"),
    usedBy: z.string().describe("Korean: who uses it / what context"),
    example: z.string().describe("One natural English example sentence"),
    awkwardIf: z.string().describe("Korean: a context where using this would be awkward or cringe"),
  }),
  news: z.object({
    headline: z.string().describe("Must be copied verbatim from the provided real headline candidates — never invented"),
    summary: z.string().describe("Korean: neutral, factual 2-3 sentence summary of the story"),
    whyItMatters: z.string().describe("Korean: why Americans are currently talking about this"),
    talkingPoint: z.string().describe("One short natural English sentence to bring this up in small talk"),
  }),
  popculture: z.object({
    title: z.string().describe("Must be copied verbatim from the provided real candidates — never invented"),
    category: z.string().describe("One of: tv, movie, music, meme, celebrity, sports, other"),
    summary: z.string().describe("Korean: what it is and why it's relevant right now"),
    reference: z.string().describe("Korean: the specific joke/meme/reference angle worth knowing"),
    talkingPoint: z.string().describe("One short natural English sentence to bring this up in conversation"),
  }),
});

function formatCandidates(list) {
  if (!list || list.length === 0) return "(실시간 후보를 가져오지 못했습니다 — 이 경우 구체적 사실을 지어내지 말고, 특정 오늘자 사건인 것처럼 단정하지 않는 일반적이고 평이한 소재로 대신하세요.)";
  return list.map((t, i) => `${i + 1}. ${t}`).join("\n");
}

function buildDailyPrompt({ dayNum, dateKey, trendContext }) {
  return `당신은 "In The Loop" 앱의 콘텐츠 생성기입니다.
대상 사용자: 미국에 13년째 거주 중인 한국 출신 1세 이민자. 영어는 이미 업무에서 무리 없이 쓸 수 있는 상급자이며, 목표는 "미국에서 나고 자란 2세"에 가까운 언어 감각과 문화 레퍼런스를 채우는 것입니다. 기초 문법/어휘 설명은 필요 없습니다.

오늘은 Day ${dayNum} (${dateKey})입니다.

다음 실제 미국 뉴스 헤드라인 후보 (오늘 수집됨):
${formatCandidates(trendContext?.news)}

다음 실제 미국 팝컬처/엔터테인먼트 헤드라인 후보 (오늘 수집됨):
${formatCandidates(trendContext?.popculture)}

규칙:
1. news.headline과 popculture.title은 위 후보 목록에 있는 실제 문구를 그대로 사용하세요. 절대 새로운 사건을 지어내지 마세요. 후보가 비어 있으면 특정 날짜의 실제 사건인 것처럼 단정하지 말고 일반적인 소재로 대체하세요.
2. 정치적으로 민감한 주제는 어느 한쪽 편을 들지 말고, 중립적으로 사실만 전달하세요.
3. 언어(language)와 슬랭(slang) 항목은 이미 영어를 잘하는 성인이 실제로 모를 법한, 뉘앙스가 있는 표현으로 고르세요. "hello", "thank you" 같은 기초 표현은 금지.
4. 모든 한국어 설명은 짧고 명확하게, 실무자에게 말하듯 자연스럽게 쓰세요.
5. 매일 다른 표현/소재를 고르세요 — 뻔하고 반복적인 예시(예: "break a leg", "piece of cake")는 피하세요.`;
}

export async function generateDailyContent({ dayNum, dateKey, trendContext }) {
  const { object } = await generateObject({
    model: DAILY_MODEL,
    schema: dailyContentSchema,
    prompt: buildDailyPrompt({ dayNum, dateKey, trendContext }),
  });
  return { source: "ai", dayNum, dateKey, ...object };
}

const gapExplanationSchema = z.object({
  correctedPhrase: z
    .string()
    .describe(
      "The clean, correctly-spelled English form of what the user most likely meant — fix typos/spacing, do not translate to Korean. If the input was already correct, return it unchanged."
    ),
  explanation: z
    .string()
    .describe(
      "Korean explanation: meaning/nuance, who uses it, one short English example sentence. 5-7 sentences max."
    ),
});

export async function explainGapPhrase(phrase) {
  const { object } = await generateObject({
    model: QUICK_MODEL,
    schema: gapExplanationSchema,
    prompt: `사용자(미국 거주 13년차 한국 출신 1세 이민자, 영어 상급자)가 실생활에서 듣거나 보고 무슨 뜻인지 몰랐던 표현/레퍼런스를 기록했습니다. 사용자가 급하게 입력하느라 오타나 띄어쓰기 오류가 있을 수 있습니다: "${phrase}"

1. correctedPhrase: 사용자가 실제로 의도했을 법한 올바른 영어 표현으로 고쳐주세요 (오타 교정만, 이미 맞으면 그대로).
2. explanation: 한국어로 설명 — 정확한 뜻과 실제 뉘앙스, 어떤 맥락/누가 주로 쓰는지, 짧은 영어 예문 1개. 정치적으로 민감한 내용이면 중립적으로 사실만 전달. 인사말/서론 없이 바로 설명으로 시작, 5~7문장 이내.`,
  });
  return object;
}

export async function synthesizeSpeech(text) {
  const { audio } = await generateSpeech({
    model: gateway.speech(SPEECH_MODEL),
    text,
    voice: "nova",
    outputFormat: "mp3",
  });
  return { bytes: audio.uint8Array, mediaType: audio.mediaType || "audio/mpeg" };
}
