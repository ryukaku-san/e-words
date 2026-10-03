/**
 * Web Speech API を利用した完全無料の英語音声読み上げユーティリティ
 */

let synth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

export function speakEnglish(text: string, onEnd?: () => void): boolean {
  if (!synth) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    return false;
  }

  // 再生中の音声を停止
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95; // 聞き取りやすい自然な速度
  utterance.pitch = 1.0;

  // 利用可能な音声一覧から高品質なUS英語音声を探す
  const voices = synth.getVoices();
  const enVoice = voices.find(
    (v) => v.lang.startsWith('en-US') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (enVoice) {
    utterance.voice = enVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = () => onEnd();
  }

  synth.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (synth) {
    synth.cancel();
  }
}
