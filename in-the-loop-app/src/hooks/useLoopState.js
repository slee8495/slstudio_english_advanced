import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "../utils/storage";
import { CARD_META, CARD_TYPES } from "../data/curriculum";
import { GRADUATED_BOX, nextBoxAfterResult, nextReviewDateKey } from "../data/reviewSchedule";

const STATE_KEY = "state_v1";

function loadInitial() {
  return readJSON(STATE_KEY, {
    progress: {}, // { [dateKey]: { language: bool, news: bool, popculture: bool, slang: bool } }
    reviewPool: [], // [{ id, kind, front, back, box, nextReviewDateKey, createdDateKey }]
    gapJournal: [], // [{ id, phrase, explanation, createdDateKey }]
  });
}

function cardToReviewCard({ cardType, content }) {
  if (cardType === "language") {
    return { front: content.phrase, back: `${content.meaning}\n\n${content.nuance}` };
  }
  if (cardType === "slang") {
    return { front: content.term, back: `${content.meaning}\n\n${content.usedBy}` };
  }
  return null;
}

export function useLoopState() {
  const [state, setState] = useState(loadInitial);

  useEffect(() => {
    writeJSON(STATE_KEY, state);
  }, [state]);

  function setCardDone(dateKey, cardType, done, content) {
    setState((prev) => {
      const dayProgress = { ...(prev.progress[dateKey] || {}), [cardType]: done };
      const progress = { ...prev.progress, [dateKey]: dayProgress };

      let reviewPool = prev.reviewPool;
      const isReviewable = CARD_META[cardType]?.reviewable;
      const alreadyAdded = reviewPool.some(
        (item) => item.kind === cardType && item.createdDateKey === dateKey
      );
      if (done && isReviewable && content && !alreadyAdded) {
        const card = cardToReviewCard({ cardType, content, dateKey });
        if (card) {
          reviewPool = [
            ...reviewPool,
            {
              id: crypto.randomUUID(),
              kind: cardType,
              front: card.front,
              back: card.back,
              box: 0,
              nextReviewDateKey: nextReviewDateKey(dateKey, 0),
              createdDateKey: dateKey,
            },
          ];
        }
      }
      return { ...prev, progress, reviewPool };
    });
  }

  function dueReviewItems(todayKey) {
    return state.reviewPool.filter(
      (item) => item.box < GRADUATED_BOX && item.nextReviewDateKey <= todayKey
    );
  }

  function recordReviewResult(id, remembered, todayKey) {
    setState((prev) => ({
      ...prev,
      reviewPool: prev.reviewPool.map((item) => {
        if (item.id !== id) return item;
        const box = nextBoxAfterResult(item.box, remembered);
        return { ...item, box, nextReviewDateKey: nextReviewDateKey(todayKey, box) };
      }),
    }));
  }

  async function addGapEntry(phrase, todayKey) {
    const id = crypto.randomUUID();
    const optimistic = { id, phrase, explanation: null, loading: true, createdDateKey: todayKey };
    setState((prev) => ({ ...prev, gapJournal: [optimistic, ...prev.gapJournal] }));

    let explanation = "설명을 불러오지 못했어요. 나중에 다시 시도해 주세요.";
    try {
      const res = await fetch("/api/gap-journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phrase }),
      });
      if (res.ok) {
        const data = await res.json();
        explanation = data.explanation;
      }
    } catch {
      // network/API failure — keep fallback explanation text above
    }

    setState((prev) => ({
      ...prev,
      gapJournal: prev.gapJournal.map((e) =>
        e.id === id ? { ...e, explanation, loading: false } : e
      ),
      reviewPool: [
        ...prev.reviewPool,
        {
          id: crypto.randomUUID(),
          kind: "gap",
          front: phrase,
          back: explanation,
          box: 0,
          nextReviewDateKey: nextReviewDateKey(todayKey, 0),
          createdDateKey: todayKey,
        },
      ],
    }));
  }

  function streakEndingAt(todayKey) {
    const dates = Object.keys(state.progress).sort();
    if (dates.length === 0) return 0;
    let streak = 0;
    let cursorKey = todayKey;
    const fullyDone = (key) => {
      const day = state.progress[key];
      if (!day) return false;
      return CARD_TYPES.every((t) => day[t]);
    };
    // today doesn't have to be done yet to keep yesterday's streak alive
    if (!fullyDone(cursorKey)) {
      const [y, m, d] = cursorKey.split("-").map(Number);
      cursorKey = new Date(Date.UTC(y, m - 1, d - 1))
        .toISOString()
        .slice(0, 10);
    }
    while (fullyDone(cursorKey)) {
      streak += 1;
      const [y, m, d] = cursorKey.split("-").map(Number);
      cursorKey = new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10);
    }
    return streak;
  }

  return {
    progress: state.progress,
    reviewPool: state.reviewPool,
    gapJournal: state.gapJournal,
    setCardDone,
    dueReviewItems,
    recordReviewResult,
    addGapEntry,
    streakEndingAt,
  };
}
