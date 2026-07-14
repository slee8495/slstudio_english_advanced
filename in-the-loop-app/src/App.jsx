import { useEffect, useMemo, useState } from "react";
import { CARD_TYPES, dayNumberFor, todayDayNumber, todayKey } from "./data/curriculum";
import { pruneOldContentCache } from "./utils/storage";
import { useLoopState } from "./hooks/useLoopState";
import { useDailyContent } from "./hooks/useDailyContent";
import Home from "./components/Home";
import ReviewSession from "./components/ReviewSession";
import GapJournal from "./components/GapJournal";
import CalendarView from "./components/CalendarView";
import AccentPractice from "./components/AccentPractice";
import BottomNav from "./components/BottomNav";
import ChatWidget from "./components/ChatWidget";

function parseDateKeyToYMD(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return { y, m, d };
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [viewedDateKey, setViewedDateKey] = useState(() => todayKey());

  const todayNum = todayDayNumber();
  const viewedDayNum = useMemo(
    () => dayNumberFor(parseDateKeyToYMD(viewedDateKey)),
    [viewedDateKey]
  );
  const isToday = viewedDateKey === todayKey();

  useEffect(() => {
    pruneOldContentCache();
  }, []);

  const {
    progress,
    gapJournal,
    setCardDone,
    dueReviewItems,
    recordReviewResult,
    addGapEntry,
    removeGapEntry,
    streakEndingAt,
  } = useLoopState();

  const { content, loading } = useDailyContent(viewedDayNum, viewedDateKey);

  const todayKeyValue = todayKey();
  const dueItems = dueReviewItems(todayKeyValue);
  const streak = streakEndingAt(todayKeyValue);

  // Once today's 4 cards are all done, tomorrow opens up for early preview
  // (selectable from the record tab) — the home screen itself still defaults
  // to real "today" until the actual America/Los_Angeles day rolls over.
  const todayFullyDone = CARD_TYPES.every((t) => progress[todayKeyValue]?.[t]);
  const unlockedDayNum = todayFullyDone ? todayNum + 1 : todayNum;
  const viewedIsFuture = viewedDateKey > todayKeyValue;

  function handleToggleDone(cardType, done, cardContent) {
    setCardDone(viewedDateKey, cardType, done, cardContent);
  }

  function handleSelectDay(dayNum, dateKey) {
    setViewedDateKey(dateKey);
    setTab("home");
  }

  function goToday() {
    setViewedDateKey(todayKey());
  }

  return (
    <div className="min-h-dvh bg-gray-50 pt-[env(safe-area-inset-top)]">
      {!isToday && (
        <div className="sticky top-0 z-10 flex items-center justify-between bg-amber-50 px-4 py-2 text-xs text-amber-800">
          <span>
            {viewedIsFuture ? "내일 미리보기 중이에요" : "지난 기록을 보고 있어요"} · Day {viewedDayNum}
          </span>
          <button type="button" onClick={goToday} className="font-semibold underline">
            오늘로 돌아가기
          </button>
        </div>
      )}

      {tab === "home" && (
        <Home
          dayNum={viewedDayNum}
          dateKey={viewedDateKey}
          isToday={isToday}
          content={content}
          loading={loading}
          dayProgress={progress[viewedDateKey]}
          onToggleDone={handleToggleDone}
          streak={streak}
          dueReviewCount={dueItems.length}
          onOpenReview={() => setTab("review")}
        />
      )}

      {tab === "review" && (
        <ReviewSession
          items={dueItems}
          onResult={(id, remembered) => recordReviewResult(id, remembered, todayKeyValue)}
        />
      )}

      {tab === "gap" && (
        <GapJournal
          entries={gapJournal}
          onAdd={(phrase) => addGapEntry(phrase, todayKeyValue)}
          onRemove={removeGapEntry}
        />
      )}

      {tab === "calendar" && (
        <CalendarView
          unlockedDayNum={unlockedDayNum}
          progress={progress}
          onSelectDay={handleSelectDay}
        />
      )}

      {tab === "accent" && <AccentPractice content={content} />}

      <ChatWidget context={{ dayNum: viewedDayNum, content }} />
      <BottomNav active={tab} onChange={setTab} reviewBadge={dueItems.length} />
    </div>
  );
}
