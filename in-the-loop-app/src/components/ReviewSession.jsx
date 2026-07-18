import { useState } from "react";
import SpeakableText from "./SpeakableText";

const KIND_LABEL = { language: "언어", slang: "슬랭", gap: "내 갭 저널" };

export default function ReviewSession({ items, onResult }) {
  // Freeze the due-review queue at mount time. `items` is recomputed from
  // live state on every parent render, and grading a card immediately makes
  // it ineligible (its nextReviewDateKey moves forward), so reading straight
  // from the live `items` prop would shrink the list out from under our
  // `index` mid-session and prematurely show the "all done" screen.
  const [queue] = useState(items);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (queue.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-gray-500">
        <p className="text-4xl">✨</p>
        <p className="mt-3 text-sm">오늘 복습할 항목이 없어요.</p>
      </div>
    );
  }

  if (index >= queue.length) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-gray-500">
        <p className="text-4xl">🎉</p>
        <p className="mt-3 text-sm">오늘 복습을 다 끝냈어요!</p>
      </div>
    );
  }

  const item = queue[index];

  function handleResult(remembered) {
    onResult(item.id, remembered);
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-36 pt-6">
      <p className="mb-4 text-center text-xs text-gray-400">
        복습 {index + 1} / {queue.length}
      </p>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <p className="mb-2 text-xs font-medium text-loop-600">{KIND_LABEL[item.kind]}</p>
        <SpeakableText as="p" text={item.front} className="text-xl font-semibold text-gray-900" />

        {revealed && (
          <p className="mt-4 whitespace-pre-line text-sm text-gray-600">{item.back}</p>
        )}
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-6 w-full rounded-xl bg-loop-600 py-3 text-sm font-medium text-white active:bg-loop-700"
        >
          뜻 보기
        </button>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleResult(false)}
            className="rounded-xl border border-gray-300 py-3 text-sm font-medium text-gray-600 active:bg-gray-50"
          >
            까먹었어요
          </button>
          <button
            type="button"
            onClick={() => handleResult(true)}
            className="rounded-xl bg-loop-600 py-3 text-sm font-medium text-white active:bg-loop-700"
          >
            기억나요
          </button>
        </div>
      )}
    </div>
  );
}
