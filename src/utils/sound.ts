import type { BadgeTier } from '../data/badges';

let audioCtx: AudioContext | null = null;

function getOrCreateAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (audioCtx && audioCtx.state === 'closed') {
      audioCtx = null;
    }
    if (!audioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      audioCtx = new AudioCtx();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * ユーザー操作イベント内で同期的に呼び出し、自動再生制限を解除しておく
 */
export function unlockAudioContext(): void {
  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;
    if (ctx.state !== 'running') {
      void ctx.resume().catch(() => {});
    }
  } catch {
    // ignore
  }
}

function withRunningAudioContext(play: (ctx: AudioContext) => void): void {
  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;
    if (ctx.state === 'running') {
      play(ctx);
      return;
    }
    void ctx
      .resume()
      .then(() => {
        if (ctx.state === 'running') {
          play(ctx);
        }
      })
      .catch(() => {});
  } catch {
    // ignore
  }
}

function scheduleTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  gainPeak: number,
  type: OscillatorType = 'triangle'
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(gainPeak, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

/**
 * ランクに応じたバッジ獲得ファンファーレを再生する
 */
export function playBadgeUnlockSound(tier: BadgeTier): void {
  withRunningAudioContext((ctx) => {
    const now = ctx.currentTime + 0.02;

    if (tier === 'bronze') {
      scheduleTone(ctx, 523.25, now, 0.18, 0.16, 'sine');
      scheduleTone(ctx, 783.99, now + 0.1, 0.34, 0.18, 'triangle');
      scheduleTone(ctx, 1567.98, now + 0.1, 0.25, 0.05, 'sine');
      return;
    }

    if (tier === 'silver') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const t = now + i * 0.08;
        const dur = i === notes.length - 1 ? 0.42 : 0.18;
        scheduleTone(ctx, freq, t, dur, 0.16, 'triangle');
        scheduleTone(ctx, freq * 2, t, dur * 0.7, 0.04, 'sine');
      });
      return;
    }

    if (tier === 'gold') {
      const arp = [523.25, 659.25, 783.99, 987.77, 1046.5];
      arp.forEach((freq, i) => {
        const t = now + i * 0.075;
        const isLast = i === arp.length - 1;
        scheduleTone(ctx, freq, t, isLast ? 0.58 : 0.2, 0.16, 'triangle');
        scheduleTone(ctx, freq * 2, t, isLast ? 0.45 : 0.14, 0.05, 'sine');
      });
      const chordStart = now + 0.3;
      [523.25, 659.25, 783.99].forEach((f) => {
        scheduleTone(ctx, f, chordStart, 0.55, 0.07, 'sine');
      });
      return;
    }

    // platinum
    const platNotes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98];
    platNotes.forEach((freq, i) => {
      const t = now + i * 0.06;
      const isLast = i === platNotes.length - 1;
      scheduleTone(ctx, freq, t, isLast ? 0.72 : 0.22, 0.15, 'triangle');
      scheduleTone(ctx, freq * 2, t + 0.01, isLast ? 0.55 : 0.14, 0.055, 'sine');
    });
    const swell = now + 0.36;
    [523.25, 783.99, 1046.5, 1318.51].forEach((f) => {
      scheduleTone(ctx, f, swell, 0.75, 0.065, 'sine');
    });
  });
}

/**
 * バッジをタップして回転させたときのメタリックなキラリ音
 */
export function playBadgeFlipSound(): void {
  withRunningAudioContext((ctx) => {
    const now = ctx.currentTime + 0.01;
    scheduleTone(ctx, 1318.51, now, 0.12, 0.09, 'sine');
    scheduleTone(ctx, 1975.53, now + 0.045, 0.18, 0.08, 'sine');
  });
}
