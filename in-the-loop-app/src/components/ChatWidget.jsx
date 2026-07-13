import { useEffect, useRef, useState } from "react";

export default function ChatWidget({ context }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply || "답변을 가져오지 못했어요." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "오류가 발생했어요. 다시 시도해 주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed right-4 z-30 flex max-h-[60dvh] w-[calc(100%-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          style={{ bottom: "calc(6.5rem + env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-800">💬 튜터에게 물어보기</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-400"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <p className="text-xs text-gray-400">
                오늘 배운 표현이나 궁금한 거 아무거나 물어보세요.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={`inline-block whitespace-pre-line rounded-2xl px-3 py-2 text-left text-sm ${
                    m.role === "user" ? "bg-loop-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {loading && <p className="text-xs text-gray-400">답변 생성 중...</p>}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-gray-100 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="궁금한 걸 물어보세요"
              className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-loop-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-loop-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              전송
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-loop-600 text-2xl text-white shadow-xl active:bg-loop-700"
        style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom))" }}
        aria-label={open ? "챗봇 닫기" : "챗봇 열기"}
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}
