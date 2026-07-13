import { CARD_TYPES } from "../data/curriculum";
import DailyCard from "./DailyCard";

export default function Home({
  dayNum,
  dateKey,
  isToday,
  content,
  loading,
  dayProgress,
  onToggleDone,
  streak,
  dueReviewCount,
  onOpenReview,
}) {
  const doneCount = CARD_TYPES.filter((t) => dayProgress?.[t]).length;

  return (
    <div className="mx-auto max-w-md px-4 pb-36 pt-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-loop-600">
            {isToday ? "오늘" : dateKey}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Day {dayNum}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="rounded-full bg-loop-100 px-3 py-1 font-semibold text-loop-700">
            🔥 {streak}일 연속
          </div>
        </div>
      </header>

      <div className="mb-5 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2 text-sm text-gray-600">
        <span>오늘 진행률</span>
        <span className="font-semibold text-loop-700">{doneCount}/{CARD_TYPES.length}</span>
      </div>

      {dueReviewCount > 0 && (
        <button
          type="button"
          onClick={onOpenReview}
          className="mb-5 flex w-full items-center justify-between rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 border border-amber-200"
        >
          <span>📚 오늘 복습할 것 {dueReviewCount}개</span>
          <span>바로가기 →</span>
        </button>
      )}

      {loading && !content && (
        <p className="py-10 text-center text-sm text-gray-400">오늘의 콘텐츠를 불러오는 중...</p>
      )}

      <div className="space-y-3">
        {CARD_TYPES.map((cardType) => (
          <DailyCard
            key={cardType}
            cardType={cardType}
            content={content?.[cardType]}
            done={Boolean(dayProgress?.[cardType])}
            onToggleDone={(done) => onToggleDone(cardType, done, content?.[cardType])}
          />
        ))}
      </div>
    </div>
  );
}
