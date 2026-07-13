// Fallback content used whenever /api/daily-content is unreachable (no AI Gateway
// key configured yet, offline, or the live generation call fails). Language/slang
// pools are hand-curated and genuinely useful on their own — they rotate forever.
// News/popculture seeds are explicitly labeled samples, since their entire point
// is to track *today's* real trends once the live pipeline is wired up.

export const LANGUAGE_POOL = [
  {
    phrase: "It is what it is",
    meaning: "그냥 그런 거지, 어쩔 수 없지",
    nuance: "불평하지 않고 상황을 받아들이겠다는 체념·수용의 톤. 짜증이 섞여도 되고, 담담해도 됨.",
    example: "The flight got delayed again — it is what it is, I guess.",
    avoidNote: "심각한 위로가 필요한 상황(예: 큰 실수, 슬픈 소식)에 쓰면 성의 없어 보일 수 있음.",
  },
  {
    phrase: "Let's circle back on that",
    meaning: "그건 나중에 다시 얘기하자",
    nuance: "미팅에서 결론을 미루거나 화제를 넘길 때 쓰는 완곡한 표현. 실제로 다시 안 다루는 경우도 많음.",
    example: "Good point, but let's circle back on that after we finalize the budget.",
    avoidNote: "친구 사이 캐주얼한 대화에는 너무 사무적으로 들림.",
  },
  {
    phrase: "I'll take a rain check",
    meaning: "이번엔 패스할게, 다음에 하자",
    nuance: "초대를 정중히 거절하면서도 관계는 유지하고 싶다는 뉘앙스. 진짜 다음을 기약하는 경우와 그냥 거절의 완곡어법인 경우 둘 다 있음.",
    example: "Can't make it to dinner tonight — can I take a rain check?",
    avoidNote: "정말 두 번 다시 안 만날 사람한테 쓰면 어색함(빈말처럼 들림을 서로 암묵적으로 앎).",
  },
  {
    phrase: "That's on me",
    meaning: "내 잘못이야, 내가 책임질게",
    nuance: "격식 없이, 하지만 진지하게 잘못을 인정하는 톤. \"My fault\"보다 좀 더 어른스럽게 들림.",
    example: "I forgot to send the file — that's on me, sending it now.",
    avoidNote: "정말 심각한 사고/법적 책임 상황에는 너무 가벼워서 부적절.",
  },
  {
    phrase: "Sounds good",
    meaning: "좋아, 그렇게 하자",
    nuance: "진짜 동의보다 그냥 '대화를 자연스럽게 마무리'하는 용도로도 많이 씀. 미팅/이메일 끝맺음의 디폴트 표현.",
    example: "I'll send the doc by Friday. — Sounds good, thanks!",
    avoidNote: "중요한 결정에 진짜 동의하는 건지 그냥 예의상인지 헷갈릴 수 있어서, 정말 중요한 건은 구체적으로 다시 확인하는 게 안전.",
  },
  {
    phrase: "Play devil's advocate",
    meaning: "일부러 반대 입장에서 얘기해볼게",
    nuance: "미팅에서 의도적으로 반박 의견을 내서 논의를 더 탄탄하게 만들 때 씀. 공격이 아니라 건설적 태도로 받아들여짐.",
    example: "Just to play devil's advocate — what if the client says no to this pricing?",
    avoidNote: "감정적으로 격해진 논쟁 중에 쓰면 불난 데 기름 붓는 느낌으로 받아들여질 수 있음.",
  },
  {
    phrase: "I'm not gonna lie",
    meaning: "솔직히 말하면",
    nuance: "약간 뜻밖의 솔직한 의견을 말하기 전에 붙이는 구어체 쿠션어. 격식 있는 자리보다는 편한 대화에 어울림.",
    example: "I'm not gonna lie, that presentation was rough.",
    avoidNote: "공식 이메일이나 격식 있는 발표에는 너무 캐주얼함.",
  },
  {
    phrase: "No worries",
    meaning: "괜찮아, 신경 쓰지 마",
    nuance: "\"You're welcome\"보다 훨씬 캐주얼. 사과에 대한 반응으로도, 감사에 대한 반응으로도 둘 다 씀.",
    example: "Sorry I'm late! — No worries at all.",
    avoidNote: "아주 격식 있는 자리(고위 임원 앞 발표 등)에서는 \"Not a problem\" 정도가 더 무난.",
  },
];

export const SLANG_POOL = [
  {
    term: "no cap",
    meaning: "진짜야, 뻥 아니야",
    usedBy: "10~20대 중심, SNS/캐주얼 대화 전반",
    example: "That movie was actually amazing, no cap.",
    awkwardIf: "격식 있는 자리나 나이 많은 상사 앞에서 쓰면 어색하게 들릴 수 있음.",
  },
  {
    term: "it's giving...",
    meaning: "~한 느낌이 들어, ~st일이야",
    usedBy: "Z세대 SNS 표현, 지금은 밀레니얼도 많이 씀",
    example: "That outfit is giving main character energy.",
    awkwardIf: "뒤에 따라오는 명사가 어색하면 (예: 너무 진지한 단어) 문장 자체가 이상해짐.",
  },
  {
    term: "mid",
    meaning: "그저 그런, 평범한 (부정적 뉘앙스)",
    usedBy: "온라인 커뮤니티/게이머 커뮤니티에서 시작, 지금은 일반 대화에도 퍼짐",
    example: "Honestly the new season was kind of mid.",
    awkwardIf: "상대방이 만든 것/애정 있는 것에 대해 직접 쓰면 무례하게 들릴 수 있음.",
  },
  {
    term: "the ick",
    meaning: "갑자기 확 정 떨어지는 느낌",
    usedBy: "연애/데이팅 맥락에서 주로, SNS 밈으로 확산",
    example: "He texted 'heyyy' and I got the ick immediately.",
    awkwardIf: "가벼운 맥락 밖(직장 등)에서 쓰면 무슨 말인지 못 알아들을 수 있음.",
  },
  {
    term: "bet",
    meaning: "콜! 좋아! (동의/확답)",
    usedBy: "캐주얼한 또래 대화, 특히 약속 잡을 때",
    example: "Wanna grab lunch at noon? — Bet.",
    awkwardIf: "이메일이나 격식 있는 답변에는 부적절.",
  },
  {
    term: "lowkey / highkey",
    meaning: "은근히 / 대놓고",
    usedBy: "전 연령대 캐주얼 대화에 폭넓게 퍼짐",
    example: "I'm lowkey excited for this, ngl.",
    awkwardIf: "공식 문서나 발표에는 안 어울림.",
  },
  {
    term: "delulu",
    meaning: "망상적인, 비현실적인 기대를 하는 (delusional의 귀여운 축약)",
    usedBy: "Z세대, 팬덤/연애 맥락 밈에서 확산",
    example: "I still think we'll get free snacks at this meeting — I know, delulu.",
    awkwardIf: "진지한 정신건강 얘기에는 부적절 (원래 뜻과 다르게 가볍게 쓰는 밈 표현).",
  },
  {
    term: "touch grass",
    meaning: "인터넷/폰 좀 그만하고 밖에 나가라 (놀리는 말)",
    usedBy: "온라인 커뮤니티 전반",
    example: "You've tweeted 40 times today... touch grass.",
    awkwardIf: "친하지 않은 사람한테 쓰면 무례하게 들릴 수 있음.",
  },
];

export const NEWS_SAMPLE_POOL = [
  {
    headline: "(예시) Fed가 금리 관련 신호를 조율 중",
    summary: "실제 서비스에서는 이 카드가 오늘 미국에서 실시간으로 화제인 뉴스로 매일 갱신됩니다.",
    whyItMatters: "직장 스몰토크에서 경제/시장 얘기가 나올 때 기본 맥락을 잡아주는 용도.",
    talkingPoint: "\"Did you see what the Fed said about rates?\" 정도로 대화를 시작할 수 있음.",
    isSample: true,
  },
  {
    headline: "(예시) 주요 스포츠 리그 플레이오프 진행 중",
    summary: "실제 서비스에서는 이 카드가 그날 화제인 스포츠 이슈로 자동 갱신됩니다.",
    whyItMatters: "미국 직장 스몰토크 단골 주제 — 팀 이름 몇 개만 알아도 대화에 낄 수 있음.",
    talkingPoint: "\"Are you following the playoffs at all?\"",
    isSample: true,
  },
  {
    headline: "(예시) AI 업계에 새로운 모델/제품 발표",
    summary: "실제 서비스에서는 이 카드가 그날의 테크 이슈로 자동 갱신됩니다.",
    whyItMatters: "요즘 어느 업계 회의에서도 AI 관련 스몰토크가 자연스럽게 나옴.",
    talkingPoint: "\"Have you tried the new [product] yet?\"",
    isSample: true,
  },
];

export const POPCULTURE_SAMPLE_POOL = [
  {
    title: "(예시) 인기 스트리밍 시리즈 시즌 피날레",
    category: "tv",
    summary: "실제 서비스에서는 이 카드가 그날 화제인 실제 작품으로 자동 갱신됩니다.",
    reference: "피날레 관련 밈/반응이 SNS에 도는 경우가 많음.",
    talkingPoint: "\"Did you catch the finale? No spoilers though!\"",
    isSample: true,
  },
  {
    title: "(예시) 시상식 시즌 화제의 순간",
    category: "awards",
    summary: "실제 서비스에서는 이 카드가 그날의 실제 시상식/화제 순간으로 자동 갱신됩니다.",
    reference: "시상식 다음날은 특히 스몰토크 소재로 자주 등장.",
    talkingPoint: "\"That speech last night was something, right?\"",
    isSample: true,
  },
  {
    title: "(예시) 바이럴 밈 포맷 하나",
    category: "meme",
    summary: "실제 서비스에서는 이 카드가 그날 SNS에서 도는 실제 밈으로 자동 갱신됩니다.",
    reference: "밈의 원조 클립/맥락을 알아야 왜 웃긴지 이해가 됨.",
    talkingPoint: "\"Have you seen that [meme] going around?\"",
    isSample: true,
  },
];

export function getSeedDailyContent(dayNum) {
  const li = ((dayNum - 1) % LANGUAGE_POOL.length + LANGUAGE_POOL.length) % LANGUAGE_POOL.length;
  const si = ((dayNum - 1) % SLANG_POOL.length + SLANG_POOL.length) % SLANG_POOL.length;
  const ni = ((dayNum - 1) % NEWS_SAMPLE_POOL.length + NEWS_SAMPLE_POOL.length) % NEWS_SAMPLE_POOL.length;
  const pi = ((dayNum - 1) % POPCULTURE_SAMPLE_POOL.length + POPCULTURE_SAMPLE_POOL.length) % POPCULTURE_SAMPLE_POOL.length;
  return {
    source: "seed",
    dayNum,
    language: LANGUAGE_POOL[li],
    slang: SLANG_POOL[si],
    news: NEWS_SAMPLE_POOL[ni],
    popculture: POPCULTURE_SAMPLE_POOL[pi],
  };
}
