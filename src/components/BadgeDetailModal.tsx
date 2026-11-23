import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { BADGE_CATEGORIES, BADGE_TIER_META } from '../data/badges';
import type { BadgeDefinition } from '../data/badges';
import { createBadgeEvalContext, getBadgeProgress } from '../utils/badgeEvaluator';
import type { BadgeEvalContext } from '../utils/badgeEvaluator';
import type { UserProgress } from '../utils/storage';
import { BadgeGraphic } from './BadgeGraphic';
import { playBadgeFlipSound, unlockAudioContext } from '../utils/sound';

interface BadgeDetailModalProps {
  badge: BadgeDefinition | null;
  progress: UserProgress;
  evalContext?: BadgeEvalContext;
  onClose: () => void;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  badge,
  progress,
  evalContext,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [spinState, setSpinState] = useState<{ badgeId: string; count: number }>({
    badgeId: '',
    count: 0,
  });

  const spinCount = badge && spinState.badgeId === badge.id ? spinState.count : 0;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (badge) {
      dialog.setAttribute('closedby', 'any');
      if (!dialog.open) {
        dialog.showModal();
      }
      closeBtnRef.current?.focus();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [badge]);

  // Safari 等 closedby 非対応ブラウザ向けのライトディスミスフォールバック
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !badge) return;
    if ('closedBy' in HTMLDialogElement.prototype) return;

    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    let pressedOutside = false;
    const onDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const onUp = (e: PointerEvent) => {
      const shouldClose = pressedOutside && isOutside(e);
      pressedOutside = false;
      if (shouldClose) {
        dialog.close();
      }
    };
    const onCancel = () => {
      pressedOutside = false;
    };

    dialog.addEventListener('pointerdown', onDown);
    dialog.addEventListener('pointerup', onUp);
    dialog.addEventListener('pointercancel', onCancel);
    return () => {
      dialog.removeEventListener('pointerdown', onDown);
      dialog.removeEventListener('pointerup', onUp);
      dialog.removeEventListener('pointercancel', onCancel);
    };
  }, [badge]);

  const handleClose = () => {
    setSpinState({ badgeId: '', count: 0 });
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.returnValue = '';
    }
    onClose();
  };

  const fallbackCtx = useMemo(
    () => (evalContext ? null : createBadgeEvalContext(progress)),
    [evalContext, progress]
  );
  const activeCtx = evalContext ?? fallbackCtx!;

  const info = badge ? getBadgeProgress(badge, activeCtx) : null;
  const unlockedRecord = badge ? progress.unlockedBadges?.[badge.id] : undefined;
  const tierMeta = badge ? BADGE_TIER_META[badge.tier] : null;
  const categoryLabel = badge
    ? BADGE_CATEGORIES.find((c) => c.id === badge.category)?.label ?? ''
    : '';

  const isUnlocked = Boolean(info?.unlocked);
  const isSecretLocked = Boolean(badge?.secret && !isUnlocked);
  const soundEnabled = progress.soundEnabled ?? true;

  const formattedDate = (() => {
    if (!unlockedRecord?.unlockedAt) return '';
    const d = new Date(unlockedRecord.unlockedAt);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  })();

  const percent =
    info && info.target > 0
      ? Math.min(100, Math.round((info.current / info.target) * 100))
      : 0;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="badge-detail-title"
      onClose={handleClose}
      className="w-[calc(100vw-2rem)] max-w-sm rounded-3xl overflow-visible"
    >
      {badge && info && tierMeta && (
        <div className="w-full max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-color)] shadow-2xl p-5 text-center">
          {/* 閉じるボタン */}
          <div className="flex items-center justify-between mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-muted)] text-[11px] font-bold text-[var(--text-muted)]">
              {categoryLabel}
            </span>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="p-1.5 rounded-full bg-[var(--bg-muted)] hover:bg-slate-200 text-[var(--text-muted)] transition cursor-pointer"
              aria-label="閉じる"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* バッジ表示 */}
          <div className="py-3 flex flex-col items-center">
            {isUnlocked ? (
              <button
                type="button"
                onClick={() => {
                  unlockAudioContext();
                  setSpinState((prev) => ({
                    badgeId: badge.id,
                    count: prev.badgeId === badge.id ? prev.count + 1 : 1,
                  }));
                  if (soundEnabled) playBadgeFlipSound();
                }}
                className="cursor-pointer rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                title="タップで回転＆キラリ"
                aria-label="バッジを回転させてみる"
              >
                <div key={spinCount} className={spinCount > 0 ? 'badge-coin-replay' : ''}>
                  <BadgeGraphic badge={badge} size={144} showShine={spinCount > 0} />
                </div>
              </button>
            ) : (
              <BadgeGraphic badge={badge} locked size={144} />
            )}

            {isUnlocked && (
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>タップで回転＆キラリ</span>
              </div>
            )}
          </div>

          {/* ランク・ステータス */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${tierMeta.pillClass}`}
            >
              {tierMeta.label}
            </span>
            {isUnlocked ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                獲得済み
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                <Lock className="w-3 h-3" />
                未獲得
              </span>
            )}
          </div>

          <h2 id="badge-detail-title" className="text-lg font-black text-[var(--text-main)]">
            {isSecretLocked ? '？？？' : badge.title}
          </h2>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1.5 px-2">
            {isSecretLocked
              ? '特定のシークレット条件を達成すると解放されます。いろいろ試してみましょう！'
              : badge.description}
          </p>

          {/* 獲得日 または 進捗バー */}
          {isUnlocked ? (
            formattedDate && (
              <div className="mt-4 py-2 px-3 rounded-xl bg-[var(--bg-muted)] text-xs font-semibold text-[var(--text-muted)]">
                獲得日: {formattedDate}
              </div>
            )
          ) : (
            !isSecretLocked && (
              <div className="mt-4 p-3 rounded-xl bg-[var(--bg-muted)] space-y-1.5 text-left">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[var(--text-muted)]">達成状況</span>
                  <span className="text-[var(--text-main)]">
                    {Math.min(info.current, info.target).toLocaleString()} /{' '}
                    {info.target.toLocaleString()} {info.unit} ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )
          )}

          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[var(--bg-muted)] hover:bg-slate-200 text-[var(--text-main)] font-bold text-xs transition cursor-pointer"
          >
            閉じる
          </button>
        </div>
      )}
    </dialog>
  );
};
