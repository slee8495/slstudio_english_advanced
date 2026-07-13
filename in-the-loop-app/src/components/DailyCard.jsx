import { useState } from "react";
import { CARD_META } from "../data/curriculum";
import SpeakableText from "./SpeakableText";

function CardBody({ cardType, content }) {
  if (cardType === "language") {
    return (
      <div className="space-y-2 text-left">
        <SpeakableText
          as="p"
          text={content.phrase}
          className="text-lg font-semibold text-loop-900"
        />
        <p className="text-sm text-gray-700">{content.meaning}</p>
        <p className="text-sm text-gray-600">{content.nuance}</p>
        <SpeakableText
          as="p"
          text={content.example}
          className="text-sm italic text-loop-700"
        />
        <p className="text-xs text-amber-700">⚠️ {content.avoidNote}</p>
      </div>
    );
  }
  if (cardType === "slang") {
    return (
      <div className="space-y-2 text-left">
        <SpeakableText
          as="p"
          text={content.term}
          className="text-lg font-semibold text-loop-900"
        />
        <p className="text-sm text-gray-700">{content.meaning}</p>
        <p className="text-sm text-gray-600">{content.usedBy}</p>
        <SpeakableText
          as="p"
          text={content.example}
          className="text-sm italic text-loop-700"
        />
        <p className="text-xs text-amber-700">⚠️ {content.awkwardIf}</p>
      </div>
    );
  }
  if (cardType === "news") {
    return (
      <div className="space-y-2 text-left">
        <SpeakableText
          as="p"
          text={content.headline}
          className="text-lg font-semibold text-loop-900"
        />
        <p className="text-sm text-gray-700">{content.summary}</p>
        <p className="text-sm text-gray-600">{content.whyItMatters}</p>
        <SpeakableText
          as="p"
          text={content.talkingPoint}
          className="text-sm italic text-loop-700"
        />
        {content.isSample && (
          <p className="text-xs text-gray-400">예시 콘텐츠 · 실시간 연동 후 매일 갱신됩니다</p>
        )}
      </div>
    );
  }
  // popculture
  return (
    <div className="space-y-2 text-left">
      <SpeakableText
        as="p"
        text={content.title}
        className="text-lg font-semibold text-loop-900"
      />
      <p className="text-sm text-gray-700">{content.summary}</p>
      <p className="text-sm text-gray-600">{content.reference}</p>
      <SpeakableText
        as="p"
        text={content.talkingPoint}
        className="text-sm italic text-loop-700"
      />
      {content.isSample && (
        <p className="text-xs text-gray-400">예시 콘텐츠 · 실시간 연동 후 매일 갱신됩니다</p>
      )}
    </div>
  );
}

export default function DailyCard({ cardType, content, done, onToggleDone }) {
  const [open, setOpen] = useState(false);
  const meta = CARD_META[cardType];

  return (
    <div
      className={`rounded-2xl border transition-colors ${
        done ? "border-loop-300 bg-loop-50" : "border-gray-200 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-2xl">{meta.emoji}</span>
        <span className="flex-1">
          <span className="block text-sm font-medium text-gray-800">{meta.label}</span>
          <span className="block text-xs text-gray-400">{open ? "접기" : "펼쳐서 보기"}</span>
        </span>
        {done && <span className="text-loop-600 text-sm font-semibold">완료 ✓</span>}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 py-4">
          {content ? <CardBody cardType={cardType} content={content} /> : (
            <p className="text-sm text-gray-400">불러오는 중...</p>
          )}
          {content && !done && (
            <button
              type="button"
              onClick={() => onToggleDone(true)}
              className="mt-3 w-full rounded-xl bg-loop-600 py-2 text-sm font-medium text-white active:bg-loop-700"
            >
              다 봤어요
            </button>
          )}
        </div>
      )}
    </div>
  );
}
