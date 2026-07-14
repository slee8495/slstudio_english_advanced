import { useState } from "react";
import { speak } from "../utils/speech";

// Icon-only play button for blocks of text too long to wrap inline
// (e.g. a full gap-journal explanation), reusing the same neural TTS.
export default function SpeakButton({ text, className = "" }) {
  const [loading, setLoading] = useState(false);

  async function handlePlay() {
    if (loading || !text) return;
    setLoading(true);
    try {
      await speak(text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label="오디오로 듣기"
      className={`shrink-0 rounded-full px-2 py-1 text-sm ${className}`}
    >
      {loading ? "⏳" : "🔊"}
    </button>
  );
}
