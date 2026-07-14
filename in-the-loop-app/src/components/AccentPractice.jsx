import { useEffect, useRef, useState } from "react";
import { speak } from "../utils/speech";

function PracticeSentence({ label, text }) {
  const [listening, setListening] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [micError, setMicError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  async function handleListen() {
    if (listening) return;
    setListening(true);
    try {
      await speak(text);
    } finally {
      setListening(false);
    }
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
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || preferred || "audio/webm",
        });
        setRecordedUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((t) => t.stop());
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
    setRecording(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <p className="mb-1 text-xs font-medium text-loop-600">{label}</p>
      <p className="mb-3 text-lg font-semibold text-gray-900">{text}</p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleListen}
          className="rounded-xl bg-loop-600 px-3 py-2 text-sm font-medium text-white active:bg-loop-700"
        >
          {listening ? "재생 중..." : "🔊 원어민 발음 듣기"}
        </button>

        {!recording ? (
          <button
            type="button"
            onClick={startRecording}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 active:bg-gray-50"
          >
            🎙 내 목소리 녹음
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
          >
            ⏹ 녹음 중지
          </button>
        )}
      </div>

      {micError && <p className="mt-2 text-xs text-red-500">{micError}</p>}

      {recordedUrl && (
        <div className="mt-3 flex items-center gap-2">
          <span className="shrink-0 text-xs text-gray-400">내 녹음</span>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            controls
            src={recordedUrl}
            className="h-8 flex-1"
            onError={() => setMicError("녹음 재생 중 오류가 발생했어요. 다시 녹음해보세요.")}
          />
        </div>
      )}
    </div>
  );
}

export default function AccentPractice({ content }) {
  const sentences = [
    content?.language?.example && {
      label: "오늘의 언어 표현",
      text: content.language.example,
    },
    content?.slang?.example && { label: "오늘의 슬랭", text: content.slang.example },
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-md px-4 pb-36 pt-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">발음 연습</h1>
      <p className="mb-4 text-sm text-gray-500">
        원어민 발음을 듣고, 내 목소리로 녹음해서 비교해보세요. 녹음은 저장되지 않고 이 화면을
        나가면 사라져요.
      </p>

      {sentences.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-400">오늘의 콘텐츠를 불러오는 중...</p>
      )}

      <div className="space-y-3">
        {sentences.map((s) => (
          <PracticeSentence key={s.text} label={s.label} text={s.text} />
        ))}
      </div>
    </div>
  );
}
