import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, X, ArrowRight, Sparkles } from 'lucide-react';
import { BADGE_DEFINITIONS, BADGE_TIER_META } from '../data/badges';
import type { BadgeDefinition } from '../data/badges';
import { BadgeGraphic } from './BadgeGraphic';
import { playBadgeFlipSound, playBadgeUnlockSound, unlockAudioContext } from '../utils/sound';

interface BadgeUnlockModalProps {
  badges: BadgeDefinition[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({
  badges,
  soundEnabled,
  onToggleSound,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstanceRef = useRef<ReturnType<typeof confetti.create> | null>(null);
  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const soundEnabledRef = useRef(soundEnabled);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [replayCount, setReplayCount] = useState(0);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const safeIndex = Math.min(currentIndex, Math.max(0, badges.length - 1));
  const currentBadge = badges.length > 0 ? badges[safeIndex] : null;
  const currentBadgeId = currentBadge?.id ?? null;

  // マウント時に Top-Layer モーダルを開き、主要ボタンへフォーカスを移動
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) {
      dialog.showModal();
    }
    primaryBtnRef.current?.focus();

    return () => {
      confettiInstanceRef.current?.reset();
      confettiInstanceRef.current = null;
    };
  }, []);

  // 獲得演出（バッジ切替時のみ実行。soundEnabled 変化で再発火させない）
  useEffect(() => {
    if (!currentBadgeId) return;
    const badge = BADGE_DEFINITIONS.find((b) => b.id === currentBadgeId);
    if (!badge) return;

    if (soundEnabledRef.current) {
      playBadgeUnlockSound(badge.tier);
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    try {
      const tierMeta = BADGE_TIER_META[badge.tier];
      if (!confettiInstanceRef.current) {
        confettiInstanceRef.current = confetti.create(canvas, { resize: true, useWorker: false });
      }
      confettiInstanceRef.current.reset();
      void confettiInstanceRef.current({
        particleCount: tierMeta.confettiCount,
        spread: badge.tier === 'platinum' ? 88 : 68,
        startVelocity: badge.tier === 'platinum' ? 42 : 34,
        origin: { y: 0.48 },
        colors: tierMeta.confettiColors,
      });
    } catch {
      // ignore confetti errors
    }

    return () => {
      confettiInstanceRef.current?.reset();
    };
  }, [currentBadgeId]);

  const handleDialogClose = () => {
    confettiInstanceRef.current?.reset();
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.returnValue = '';
    }
    onClose();
  };

  const handleNextOrClose = () => {
    unlockAudioContext();
    if (safeIndex + 1 < badges.length) {
      setCurrentIndex(safeIndex + 1);
      setReplayCount(0);
    } else {
      dialogRef.current?.close();
    }
  };

  const handleReplayTap = () => {
    unlockAudioContext();
    setReplayCount((c) => c + 1);
    if (soundEnabled) {
      playBadgeFlipSound();
    }
  };

  const handleSoundToggleClick = () => {
    unlockAudioContext();
    onToggleSound();
  };

  const tierMeta = currentBadge ? BADGE_TIER_META[currentBadge.tier] : null;
  const hasMore = safeIndex + 1 < badges.length;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="badge-unlock-title"
      onClose={handleDialogClose}
      className="w-[calc(100vw-2rem)] max-w-sm rounded-3xl overflow-visible"
    >
      {/* Top-Layer 内で紙吹雪を描画する専用キャンバス */}
      <canvas
        ref={confettiCanvasRef}
        className="pointer-events-none fixed inset-0 w-full h-full z-20"
      />

      {currentBadge && tierMeta && (
        <div className="relative z-10 w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden rounded-3xl bg-slate-900 text-white border border-slate-700/80 shadow-2xl p-5 text-center">
          {/* 上部コントロールバー */}
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="text-xs font-bold text-slate-300">
              {badges.length > 1 ? (
                <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
                  {safeIndex + 1} / {badges.length}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>UNLOCKED</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSoundToggleClick}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                title={soundEnabled ? '効果音をオフにする' : '効果音をオンにする'}
                aria-label={soundEnabled ? '効果音をオフにする' : '効果音をオンにする'}
                aria-pressed={soundEnabled}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                aria-label="閉じる"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* バッジステージ（後光＋サンバースト＋3D回転バッジ） */}
          <div className="relative flex items-center justify-center py-5">
            {/* サンバースト光線 */}
            <svg
              key={`sun-${currentBadge.id}`}
              viewBox="0 0 200 200"
              className="absolute w-56 h-56 pointer-events-none badge-sunburst-enter"
              aria-hidden="true"
            >
              <g transform="translate(100,100)" fill={tierMeta.haloColor}>
                {Array.from({ length: 12 }).map((_, idx) => (
                  <polygon
                    key={idx}
                    points="0,0 -8,-95 8,-95"
                    transform={`rotate(${idx * 30})`}
                  />
                ))}
              </g>
            </svg>

            {/* 放射状グロー */}
            <div
              key={`halo-${currentBadge.id}`}
              className="absolute w-40 h-40 rounded-full blur-2xl pointer-events-none badge-halo-burst"
              style={{ backgroundColor: tierMeta.haloColor }}
            />

            {/* タップで再回転できるバッジ本体 */}
            <button
              type="button"
              onClick={handleReplayTap}
              className="relative z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full p-1"
              title="タップで回転＆キラリ"
              aria-label="バッジを回転させてみる"
            >
              <div
                key={`coin-${currentBadge.id}-${replayCount}`}
                className={replayCount === 0 ? 'badge-coin-enter' : 'badge-coin-replay'}
              >
                <BadgeGraphic badge={currentBadge} size={160} showShine />
              </div>
            </button>
          </div>

          {/* タイトル＆説明 */}
          <div key={`info-${currentBadge.id}`} className="space-y-2 relative z-10 badge-text-rise">
            <div className="flex items-center justify-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${tierMeta.pillClass}`}
              >
                {tierMeta.enLabel}
              </span>
              <span className="text-xs font-bold text-amber-300">新しいバッジを獲得！</span>
            </div>

            <h2 id="badge-unlock-title" className="text-xl font-black text-white tracking-tight">
              {currentBadge.title}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed px-2">
              {currentBadge.description}
            </p>

            <div className="text-[11px] text-slate-400 pt-0.5">
              バッジをタップすると回転します
            </div>
          </div>

          {/* アクションボタン */}
          <div className="mt-5 relative z-10">
            <button
              ref={primaryBtnRef}
              type="button"
              onClick={handleNextOrClose}
              className="w-full py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>
                {hasMore ? `次のバッジを見る (${safeIndex + 1}/${badges.length})` : 'やったね！閉じる'}
              </span>
              {hasMore && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
};
