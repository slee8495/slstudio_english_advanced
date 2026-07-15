import { CARD_TYPES, dateKeyForDayNumber } from "../data/curriculum";

export default function CalendarView({ unlockedDayNum, startYMD, progress, onSelectDay }) {
  const days = Array.from({ length: unlockedDayNum }, (_, i) => unlockedDayNum - i); // newest first

  return (
    <div className="mx-auto max-w-md px-4 pb-36 pt-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">전체 기록</h1>
      <p className="mb-4 text-sm text-gray-500">지난 날짜는 언제든 다시 볼 수 있어요.</p>

      <div className="space-y-2">
        {days.map((dayNum) => {
          const dateKey = dateKeyForDayNumber(dayNum, startYMD);
          const dayProgress = progress[dateKey];
          const doneCount = CARD_TYPES.filter((t) => dayProgress?.[t]).length;
          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => onSelectDay(dayNum, dateKey)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left active:bg-gray-50"
            >
              <span>
                <span className="block text-sm font-medium text-gray-800">Day {dayNum}</span>
                <span className="block text-xs text-gray-400">{dateKey}</span>
              </span>
              <span
                className={`text-sm font-semibold ${
                  doneCount === CARD_TYPES.length ? "text-loop-600" : "text-gray-400"
                }`}
              >
                {doneCount}/{CARD_TYPES.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
