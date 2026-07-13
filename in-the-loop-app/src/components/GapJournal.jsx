import { useState } from "react";

export default function GapJournal({ entries, onAdd }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const phrase = text.trim();
    if (!phrase || submitting) return;
    setSubmitting(true);
    setText("");
    await onAdd(phrase);
    setSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">내 갭 저널</h1>
      <p className="mb-4 text-sm text-gray-500">
        오늘 못 알아들은 표현이나 레퍼런스를 그 자리에서 기록해두세요.
      </p>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="예: 'that's giving...' 이게 뭔 뜻이지?"
          className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-loop-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="rounded-xl bg-loop-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          추가
        </button>
      </form>

      <div className="space-y-3">
        {entries.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">
            아직 기록된 표현이 없어요. 위에서 첫 항목을 추가해보세요.
          </p>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="font-semibold text-gray-900">{entry.phrase}</p>
            {entry.loading ? (
              <p className="mt-2 text-sm text-gray-400">설명 생성 중...</p>
            ) : (
              <p className="mt-2 whitespace-pre-line text-sm text-gray-600">{entry.explanation}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">{entry.createdDateKey}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
