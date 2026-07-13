import { useMemo, useState } from "react";
import SpeakableText from "./SpeakableText";

function groupByDate(entries) {
  const map = new Map();
  for (const entry of entries) {
    const list = map.get(entry.createdDateKey) || [];
    list.push(entry);
    map.set(entry.createdDateKey, list);
  }
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)); // newest date first
}

export default function GapJournal({ entries, onAdd, onRemove }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const grouped = useMemo(() => groupByDate(entries), [entries]);
  const [expandedDate, setExpandedDate] = useState(() => grouped[0]?.[0] ?? null);

  async function handleSubmit(e) {
    e.preventDefault();
    const phrase = text.trim();
    if (!phrase || submitting) return;
    setSubmitting(true);
    setText("");
    await onAdd(phrase);
    setSubmitting(false);
  }

  function toggleDate(dateKey) {
    setExpandedDate((prev) => (prev === dateKey ? null : dateKey));
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-36 pt-6">
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

      <div className="space-y-2">
        {grouped.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">
            아직 기록된 표현이 없어요. 위에서 첫 항목을 추가해보세요.
          </p>
        )}

        {grouped.map(([dateKey, dayEntries]) => {
          const isOpen = expandedDate === dateKey;
          return (
            <div key={dateKey} className="rounded-2xl border border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => toggleDate(dateKey)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-medium text-gray-800">{dateKey}</span>
                <span className="text-xs text-gray-400">
                  {dayEntries.length}개 {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <div className="space-y-3 border-t border-gray-100 px-4 py-3">
                  {dayEntries.map((entry) => (
                    <div key={entry.id} className="rounded-xl bg-gray-50 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <SpeakableText
                          as="p"
                          text={entry.phrase}
                          className="font-semibold text-gray-900"
                        />
                        <button
                          type="button"
                          onClick={() => onRemove(entry.id)}
                          className="shrink-0 text-xs text-gray-400 active:text-red-500"
                          aria-label="삭제"
                        >
                          🗑
                        </button>
                      </div>
                      {entry.loading ? (
                        <p className="mt-2 text-sm text-gray-400">설명 생성 중...</p>
                      ) : (
                        <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                          {entry.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
