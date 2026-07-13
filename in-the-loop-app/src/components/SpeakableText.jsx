import { speak } from "../utils/speech";

// Wraps any English text so tapping it plays TTS — same pattern as learn_japanese's tap-to-hear.
export default function SpeakableText({ text, as: Tag = "span", className = "" }) {
  return (
    <Tag
      role="button"
      tabIndex={0}
      onClick={() => speak(text)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") speak(text);
      }}
      className={`inline cursor-pointer decoration-dotted underline-offset-4 hover:underline ${className}`}
    >
      {text}
      <span className="ml-1 text-[0.8em] opacity-60">🔊</span>
    </Tag>
  );
}
