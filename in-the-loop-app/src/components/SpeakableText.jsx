import { useState } from "react";
import { speak } from "../utils/speech";

// Wraps any English text so tapping it plays neural TTS — same "tap to hear"
// pattern as learn_japanese, but via /api/speak instead of the robotic
// built-in browser voice.
export default function SpeakableText({ text, as: Tag = "span", className = "" }) {
  const [loading, setLoading] = useState(false);

  async function handlePlay() {
    if (loading) return;
    setLoading(true);
    try {
      await speak(text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Tag
      role="button"
      tabIndex={0}
      onClick={handlePlay}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handlePlay();
      }}
      className={`inline cursor-pointer decoration-dotted underline-offset-4 hover:underline ${className}`}
    >
      {text}
      <span className="ml-1 text-[0.8em] opacity-60">{loading ? "⏳" : "🔊"}</span>
    </Tag>
  );
}
