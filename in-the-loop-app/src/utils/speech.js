// Neural TTS via /api/speak (OpenAI tts-1-hd through AI Gateway) — sounds like
// a real person, not the robotic browser voice. Falls back to the Web Speech
// API if the network call fails (offline, cold start, etc).
const audioUrlCache = new Map();
let currentAudio = null;

function speakWithBrowserVoice(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

export async function speak(text) {
  if (!text) return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  try {
    let url = audioUrlCache.get(text);
    if (!url) {
      const res = await fetch(`/api/speak?text=${encodeURIComponent(text)}`);
      if (!res.ok) throw new Error("tts request failed");
      const blob = await res.blob();
      url = URL.createObjectURL(blob);
      audioUrlCache.set(text, url);
    }
    currentAudio = new Audio(url);
    await currentAudio.play();
  } catch {
    speakWithBrowserVoice(text);
  }
}
