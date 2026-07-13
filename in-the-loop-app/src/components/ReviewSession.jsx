import { useState } from "react";

const KIND_LABEL = { language: "언어", slang: "슬랭", gap: "내 갭 저널" };

export default function ReviewSession({ items, onResult }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-gray-500">
        <p className="text-4xl">✨</p>
        <p className="mt-3 text-sm">오늘 복습할 항목이 없어요.</p>
      </div>
    );
  }

  if (index >= items.length) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-gray-500">
        <p className="text-4xl">🎉</p>
        <p className="mt-3 text-sm">오늘 복습을 다 끝냈어요!</p>
      </div>
    );
  }

  const item = items[index];

  function handleResult(remembered) {
    onResult(item.id, remembered);
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-6">
      <p className="mb-4 text-center text-xs text-gray-400">
        복습 {index + 1} / {items.length}
      </p>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <p className="mb-2 text-xs font-medium text-loop-600">{KIND_LABEL[item.kind]}</p>
        <p className="text-xl font-semibold text-gray-900">{item.front}</p>

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
