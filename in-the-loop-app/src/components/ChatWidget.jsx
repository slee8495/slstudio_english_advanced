import { useEffect, useRef, useState } from "react";

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function ChatWidget({ context }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [micError, setMicError] = useState(null);
  const scrollRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function sendText(text) {
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
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

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendText(text);
  }

  async function startRecording() {
    setMicError(null);

    if (typeof MediaRecorder === "undefined") {
      setMicError("이 브라우저는 음성 녹음을 지원하지 않아요.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Safari/iOS doesn't support webm — it records mp4/aac instead. Rather
      // than assume a format, always read back whatever the recorder actually
      // used (recorder.mimeType) so the Blob's label matches its real bytes.
      const preferred = ["audio/mp4", "audio/webm", "audio/ogg"].find(
        (t) => MediaRecorder.isTypeSupported?.(t)
      );
      const recorder = preferred
        ? new MediaRecorder(stream, { mimeType: preferred })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || preferred || "audio/webm",
        });
        setTranscribing(true);
        try {
          const audio = await blobToBase64(blob);
          const res = await fetch("/api/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio }),
          });
          if (!res.ok) throw new Error("transcription failed");
          const { text } = await res.json();
          if (text?.trim()) await sendText(text.trim());
        } catch {
          setMicError("음성을 인식하지 못했어요. 다시 시도하거나 직접 입력해 주세요.");
        } finally {
          setTranscribing(false);
        }
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      setMicError("마이크 권한이 필요해요. 브라우저 설정에서 허용해주세요.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setRecording(false);
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

          {micError && <p className="px-4 pb-1 text-xs text-red-500">{micError}</p>}

          <form onSubmit={handleSend} className="flex gap-2 border-t border-gray-100 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={recording || transcribing}
              placeholder={
                recording ? "듣고 있어요..." : transcribing ? "인식 중..." : "궁금한 걸 물어보세요"
              }
              className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-loop-500 focus:outline-none disabled:bg-gray-50"
            />
            <button
              type="button"
              onClick={() => (recording ? stopRecording() : startRecording())}
              disabled={loading || transcribing}
              aria-pressed={recording}
              aria-label={recording ? "녹음 중지" : "음성으로 물어보기"}
              className={`rounded-xl px-3 py-2 text-sm disabled:opacity-40 ${
                recording ? "bg-red-500 text-white" : "border border-gray-300 text-gray-500"
              }`}
            >
              {recording ? "⏹" : "🎤"}
            </button>
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
