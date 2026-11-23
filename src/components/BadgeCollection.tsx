import React, { useMemo, useState } from 'react';
import { Award, Volume2, VolumeX } from 'lucide-react';
import { BADGE_CATEGORIES, BADGE_DEFINITIONS, BADGE_TIER_META } from '../data/badges';
import type { BadgeCategory, BadgeDefinition, BadgeTier } from '../data/badges';
import { createBadgeEvalContext, getBadgeProgress } from '../utils/badgeEvaluator';
import type { UserProgress } from '../utils/storage';
import { BadgeGraphic } from './BadgeGraphic';
import { BadgeDetailModal } from './BadgeDetailModal';

interface BadgeCollectionProps {
  progress: UserProgress;
  onToggleSound: () => void;
}

const TIER_ORDER: BadgeTier[] = ['bronze', 'silver', 'gold', 'platinum'];

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({ progress, onToggleSound }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | BadgeCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [inspectedBadge, setInspectedBadge] = useState<BadgeDefinition | null>(null);

  const unlockedMap = useMemo(() => progress.unlockedBadges ?? {}, [progress.unlockedBadges]);
  const evalCtx = useMemo(() => createBadgeEvalContext(progress), [progress]);
  const soundEnabled = progress.soundEnabled ?? true;

  const summary = useMemo(() => {
    let unlockedCount = 0;
    const byTier: Record<BadgeTier, { unlocked: number; total: number }> = {
      bronze: { unlocked: 0, total: 0 },
      silver: { unlocked: 0, total: 0 },
      gold: { unlocked: 0, total: 0 },
      platinum: { unlocked: 0, total: 0 },
    };
    const byCategory: Record<BadgeCategory, { unlocked: number; total: number }> = {
      streak: { unlocked: 0, total: 0 },
      perfect: { unlocked: 0, total: 0 },
      deck: { unlocked: 0, total: 0 },
      volume: { unlocked: 0, total: 0 },
      style: { unlocked: 0, total: 0 },
      secret: { unlocked: 0, total: 0 },
    };

    for (const badge of BADGE_DEFINITIONS) {
      const isUnlocked = Boolean(unlockedMap[badge.id]);
      byTier[badge.tier].total += 1;
      byCategory[badge.category].total += 1;
      if (isUnlocked) {
        unlockedCount += 1;
        byTier[badge.tier].unlocked += 1;
        byCategory[badge.category].unlocked += 1;
      }
    }

    return {
      unlockedCount,
      totalCount: BADGE_DEFINITIONS.length,
      percent: Math.round((unlockedCount / BADGE_DEFINITIONS.length) * 100),
      byTier,
      byCategory,
    };
  }, [unlockedMap]);

  const filteredBadges = useMemo(() => {
    return BADGE_DEFINITIONS.filter((badge) => {
      if (selectedCategory !== 'all' && badge.category !== selectedCategory) return false;
      const isUnlocked = Boolean(unlockedMap[badge.id]);
      if (statusFilter === 'unlocked' && !isUnlocked) return false;
      if (statusFilter === 'locked' && isUnlocked) return false;
      return true;
    });
  }, [selectedCategory, statusFilter, unlockedMap]);

  return (
    <div className="w-full max-w-md mx-auto space-y-3.5">
      {/* サマリーカード */}
      <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--card-shadow)] space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[var(--primary)]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[var(--text-main)]">
                バッジコレクション
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                獲得済み <span className="font-bold text-[var(--text-main)]">{summary.unlockedCount}</span> /{' '}
                {summary.totalCount}（{summary.percent}%）
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleSound}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
              soundEnabled
                ? 'bg-blue-50 text-[var(--primary)] border-blue-200'
                : 'bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border-color)]'
            }`}
            title={soundEnabled ? 'バッジ獲得時の効果音: ON' : 'バッジ獲得時の効果音: OFF'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? '効果音 ON' : '効果音 OFF'}</span>
          </button>
        </div>

        {/* 全体プログレスバー */}
        <div className="w-full h-2 rounded-full bg-[var(--bg-muted)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 transition-all duration-300"
            style={{ width: `${summary.percent}%` }}
          />
        </div>

        {/* ランク別内訳 */}
        <div className="grid grid-cols-4 gap-1.5 pt-0.5">
          {TIER_ORDER.map((tier) => {
            const meta = BADGE_TIER_META[tier];
            const counts = summary.byTier[tier];
            return (
              <div
                key={tier}
                className="px-2 py-1.5 rounded-xl bg-[var(--bg-muted)] text-center"
              >
                <div className="text-[10px] font-bold text-[var(--text-muted)]">{meta.label}</div>
                <div className="text-xs font-extrabold text-[var(--text-main)] mt-0.5">
                  {counts.unlocked}
                  <span className="text-[10px] font-medium text-[var(--text-muted)]">
                    /{counts.total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* カテゴリフィルタ */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[var(--primary)] text-white'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)] hover:text-[var(--text-main)]'
          }`}
        >
          すべて ({summary.unlockedCount}/{summary.totalCount})
        </button>

        {BADGE_CATEGORIES.map((cat) => {
          const counts = summary.byCategory[cat.id];
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                active
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)] hover:text-[var(--text-main)]'
              }`}
            >
              {cat.label} ({counts.unlocked}/{counts.total})
            </button>
          );
        })}
      </div>

      {/* 獲得状況サブフィルタ */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold text-[var(--text-muted)]">
          {filteredBadges.length} 個表示中
        </span>
        <div className="flex items-center gap-1 bg-[var(--bg-card)] p-0.5 rounded-lg border border-[var(--border-color)] text-[11px] font-bold">
          {(
            [
              { id: 'all', label: 'すべて' },
              { id: 'unlocked', label: '獲得済' },
              { id: 'locked', label: '未獲得' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2 py-1 rounded-md transition cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* バッジ3列グリッド */}
      {filteredBadges.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-center text-xs text-[var(--text-muted)]">
          該当するバッジがありません。
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {filteredBadges.map((badge) => {
            const info = getBadgeProgress(badge, evalCtx);
            const isUnlocked = info.unlocked;
            const isSecretLocked = Boolean(badge.secret && !isUnlocked);
            const pct =
              info.target > 0 ? Math.min(100, Math.round((info.current / info.target) * 100)) : 0;

            return (
              <button
                key={badge.id}
                type="button"
                onClick={() => setInspectedBadge(badge)}
                className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between gap-1.5 transition cursor-pointer active:scale-95 ${
                  isUnlocked
                    ? 'bg-[var(--bg-card)] border-[var(--border-color)] shadow-sm hover:border-[var(--primary)]'
                    : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <BadgeGraphic badge={badge} locked={!isUnlocked} size={68} />

                <div className="w-full space-y-1">
                  <div
                    className={`text-[11px] font-bold leading-tight line-clamp-2 min-h-[28px] flex items-center justify-center ${
                      isUnlocked ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {isSecretLocked ? '？？？' : badge.title}
                  </div>

                  {isUnlocked ? (
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                        BADGE_TIER_META[badge.tier].pillClass
                      }`}
                    >
                      {BADGE_TIER_META[badge.tier].label}
                    </span>
                  ) : isSecretLocked ? (
                    <span className="inline-block text-[9px] font-semibold text-slate-400">
                      シークレット
                    </span>
                  ) : (
                    <div className="w-full space-y-0.5">
                      <div className="w-full h-1 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-[var(--primary)]/70"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-[9px] font-semibold text-[var(--text-muted)]">
                        {Math.min(info.current, info.target).toLocaleString()}/
                        {info.target.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 詳細モーダル */}
      <BadgeDetailModal
        badge={inspectedBadge}
        progress={progress}
        evalContext={evalCtx}
        onClose={() => setInspectedBadge(null)}
      />
    </div>
  );
};
