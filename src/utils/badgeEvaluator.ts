import { BADGE_DEFINITIONS, BADGE_TIER_META } from '../data/badges';
import type { BadgeDefinition } from '../data/badges';
import type { BadgeRecord, BadgeStats, UserProgress } from './storage';

export const ARTICLE_CATEGORY_TITLES = [
  '重要語彙',
  'AI・技術専門用語',
  '熟語・句動詞',
  '英文法・構文',
  'すべての項目',
  '苦手・ブックマーク問題',
] as const;

export const TARGET_RANGE_TITLES: string[] = (() => {
  const titles: string[] = [];
  for (let start = 1; start <= 1900; start += 20) {
    const end = Math.min(start + 19, 1900);
    titles.push(`ターゲット1900 No.${start}–${end}`);
  }
  return titles;
})();

const TARGET_PART1_TITLES = TARGET_RANGE_TITLES.slice(0, 40); // No.1–800
const TARGET_PART2_TITLES = TARGET_RANGE_TITLES.slice(40, 75); // No.801–1500
const TARGET_PART3_TITLES = TARGET_RANGE_TITLES.slice(75, 95); // No.1501–1900
const TARGET_TITLE_SET = new Set(TARGET_RANGE_TITLES);
const ARTICLE_TITLE_SET = new Set<string>(ARTICLE_CATEGORY_TITLES);
const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function createEmptyBadgeStats(): BadgeStats {
  return {
    maxStreakDays: 0,
    perfectSessions: 0,
    perfectShuffleSessions: 0,
    perfectJaEnSessions: 0,
    perfectHardcoreSessions: 0,
    currentCorrectCombo: 0,
    maxCorrectCombo: 0,
    clearedCategories: [],
    perfectCategories: [],
    jaEnClears: 0,
    shuffleClears: 0,
    bookmarkPerfectClears: 0,
    everBookmarked: false,
    bookmarkClearedToZero: false,
    audioPlayCount: 0,
    resilientClears: 0,
    earlyBirdCount: 0,
    nightOwlCount: 0,
    comebackCount: 0,
    maxDailyCategories: 0,
  };
}

export function parseDateKeyToUtcDays(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

function getStudiedDates(progress: UserProgress): string[] {
  const dateSet = new Set<string>();
  for (const r of Object.values(progress.history || {})) {
    if (r && r.totalAnswered > 0 && typeof r.date === 'string' && DATE_KEY_RE.test(r.date)) {
      dateSet.add(r.date);
    }
  }
  return Array.from(dateSet).sort();
}

function computeLongestStreakFromHistory(dates: string[]): number {
  if (dates.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = parseDateKeyToUtcDays(dates[i]) - parseDateKeyToUtcDays(dates[i - 1]);
    if (diff === 1) {
      current += 1;
      if (current > longest) longest = current;
    } else if (diff > 1) {
      current = 1;
    }
  }
  return longest;
}

function hasHistoricalComeback(dates: string[]): boolean {
  for (let i = 1; i < dates.length; i++) {
    const diff = parseDateKeyToUtcDays(dates[i]) - parseDateKeyToUtcDays(dates[i - 1]);
    if (diff >= 7) return true;
  }
  return false;
}

function computeBestWeekdayRun(dates: string[]): number {
  if (dates.length === 0) return 0;
  const weekBuckets = new Map<number, Set<number>>();
  for (const dateStr of dates) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const utcDay = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Sun..6=Sat
    if (utcDay >= 1 && utcDay <= 5) {
      const epochDays = parseDateKeyToUtcDays(dateStr);
      const mondayDays = epochDays - (utcDay - 1);
      let set = weekBuckets.get(mondayDays);
      if (!set) {
        set = new Set<number>();
        weekBuckets.set(mondayDays, set);
      }
      set.add(utcDay);
    }
  }
  let best = 0;
  for (const set of weekBuckets.values()) {
    if (set.size > best) best = set.size;
  }
  return best;
}

function computeBestWeekendRun(dates: string[]): number {
  if (dates.length === 0) return 0;
  const weekendBuckets = new Map<number, Set<number>>();
  for (const dateStr of dates) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const utcDay = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    if (utcDay === 6 || utcDay === 0) {
      const epochDays = parseDateKeyToUtcDays(dateStr);
      const satDays = utcDay === 6 ? epochDays : epochDays - 1;
      let set = weekendBuckets.get(satDays);
      if (!set) {
        set = new Set<number>();
        weekendBuckets.set(satDays, set);
      }
      set.add(utcDay);
    }
  }
  let best = 0;
  for (const set of weekendBuckets.values()) {
    if (set.size > best) best = set.size;
  }
  return best;
}

function hasPerfectMonth(dates: string[]): boolean {
  if (dates.length === 0) return false;
  const monthBuckets = new Map<string, Set<string>>();
  for (const dateStr of dates) {
    const ym = dateStr.slice(0, 7);
    let set = monthBuckets.get(ym);
    if (!set) {
      set = new Set<string>();
      monthBuckets.set(ym, set);
    }
    set.add(dateStr);
  }
  for (const [ym, set] of monthBuckets.entries()) {
    const [y, m] = ym.split('-').map(Number);
    const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
    if (set.size >= daysInMonth) return true;
  }
  return false;
}

function countIn(list: string[], set: Set<string>): number {
  let count = 0;
  for (const title of list) {
    if (set.has(title)) count += 1;
  }
  return count;
}

export interface BadgeEvalContext {
  isEvalContext: true;
  stats: BadgeStats;
  unlockedBadges: Record<string, BadgeRecord>;
  streakDays: number;
  bookmarksLength: number;
  totalDays: number;
  totalAnswers: number;
  maxDailyAnswers: number;
  maxDailyCategories: number;
  bestWeekdayRun: number;
  bestWeekendRun: number;
  hasPerfectMonth: boolean;
  clearedSet: Set<string>;
  perfectSet: Set<string>;
  targetClearedCount: number;
  targetPart1Count: number;
  targetPart2Count: number;
  targetPart3Count: number;
  targetPerfectCount: number;
  dualDeckCount: number;
}

export function createBadgeEvalContext(progress: UserProgress): BadgeEvalContext {
  const stats = progress.badgeStats ?? createEmptyBadgeStats();
  const studiedDates = getStudiedDates(progress);

  let totalAnswers = 0;
  let maxDailyAnswers = 0;
  let maxDailyCategories = stats.maxDailyCategories;
  let hasTargetInHistory = false;
  let hasArticleInHistory = false;

  for (const r of Object.values(progress.history || {})) {
    if (!r) continue;
    totalAnswers += r.totalAnswered;
    if (r.totalAnswered > maxDailyAnswers) maxDailyAnswers = r.totalAnswered;
    const catLen = r.categories?.length ?? 0;
    if (catLen > maxDailyCategories) maxDailyCategories = catLen;
    if (r.categories) {
      for (const c of r.categories) {
        if (!hasTargetInHistory && (TARGET_TITLE_SET.has(c) || c.startsWith('ターゲット1900'))) {
          hasTargetInHistory = true;
        }
        if (!hasArticleInHistory && ARTICLE_TITLE_SET.has(c)) {
          hasArticleInHistory = true;
        }
      }
    }
  }

  const clearedSet = new Set(stats.clearedCategories);
  const perfectSet = new Set(stats.perfectCategories);

  const hasTargetAny =
    hasTargetInHistory ||
    stats.clearedCategories.some((c) => TARGET_TITLE_SET.has(c) || c.startsWith('ターゲット1900'));
  const hasArticleAny =
    hasArticleInHistory ||
    stats.clearedCategories.some((c) => ARTICLE_TITLE_SET.has(c));

  return {
    isEvalContext: true,
    stats,
    unlockedBadges: progress.unlockedBadges || {},
    streakDays: progress.streakDays,
    bookmarksLength: progress.bookmarks.length,
    totalDays: studiedDates.length,
    totalAnswers,
    maxDailyAnswers,
    maxDailyCategories,
    bestWeekdayRun: computeBestWeekdayRun(studiedDates),
    bestWeekendRun: computeBestWeekendRun(studiedDates),
    hasPerfectMonth: hasPerfectMonth(studiedDates),
    clearedSet,
    perfectSet,
    targetClearedCount: countIn(TARGET_RANGE_TITLES, clearedSet),
    targetPart1Count: countIn(TARGET_PART1_TITLES, clearedSet),
    targetPart2Count: countIn(TARGET_PART2_TITLES, clearedSet),
    targetPart3Count: countIn(TARGET_PART3_TITLES, clearedSet),
    targetPerfectCount: countIn(TARGET_RANGE_TITLES, perfectSet),
    dualDeckCount: (hasTargetAny ? 1 : 0) + (hasArticleAny ? 1 : 0),
  };
}

function isBadgeEvalContext(val: UserProgress | BadgeEvalContext): val is BadgeEvalContext {
  return 'isEvalContext' in val && val.isEvalContext === true;
}

export interface BadgeProgressInfo {
  current: number;
  target: number;
  unit: string;
  unlocked: boolean;
}

export function getBadgeProgress(
  badge: BadgeDefinition,
  progressOrCtx: UserProgress | BadgeEvalContext
): BadgeProgressInfo {
  const ctx = isBadgeEvalContext(progressOrCtx)
    ? progressOrCtx
    : createBadgeEvalContext(progressOrCtx);

  const { stats } = ctx;
  const unlocked = Boolean(ctx.unlockedBadges[badge.id]);

  const computeCurrent = (): number => {
    const id = badge.id;

    if (id.startsWith('streak_')) {
      return Math.max(ctx.streakDays, stats.maxStreakDays);
    }
    if (id.startsWith('total_days_')) {
      return ctx.totalDays;
    }
    if (id === 'weekday_complete') return ctx.bestWeekdayRun;
    if (id === 'weekend_warrior') return ctx.bestWeekendRun;
    if (id === 'monthly_perfect') return ctx.hasPerfectMonth ? 1 : 0;

    if (
      id === 'perfect_1' ||
      id === 'perfect_5' ||
      id === 'perfect_10' ||
      id === 'perfect_30' ||
      id === 'perfect_50' ||
      id === 'perfect_100'
    ) {
      return stats.perfectSessions;
    }
    if (id === 'perfect_shuffle') return stats.perfectShuffleSessions;
    if (id === 'perfect_ja_en') return stats.perfectJaEnSessions;
    if (id === 'perfect_hardcore') return stats.perfectHardcoreSessions;

    if (id.startsWith('combo_')) return stats.maxCorrectCombo;
    if (id.startsWith('perfect_ranges_')) return ctx.perfectSet.size;

    if (
      id === 'target_range_1' ||
      id === 'target_range_10' ||
      id === 'target_range_25' ||
      id === 'target_range_50' ||
      id === 'target_complete'
    ) {
      return ctx.targetClearedCount;
    }
    if (id === 'target_part1') return ctx.targetPart1Count;
    if (id === 'target_part2') return ctx.targetPart2Count;
    if (id === 'target_part3') return ctx.targetPart3Count;
    if (id === 'target_all_perfect') return ctx.targetPerfectCount;

    if (id === 'article_general') return ctx.clearedSet.has('重要語彙') ? 1 : 0;
    if (id === 'article_tech') return ctx.clearedSet.has('AI・技術専門用語') ? 1 : 0;
    if (id === 'article_idiom') return ctx.clearedSet.has('熟語・句動詞') ? 1 : 0;
    if (id === 'article_grammar') return ctx.clearedSet.has('英文法・構文') ? 1 : 0;
    if (id === 'article_all_clear') return ctx.clearedSet.has('すべての項目') ? 1 : 0;
    if (id === 'article_all_perfect') return ctx.perfectSet.has('すべての項目') ? 1 : 0;
    if (id === 'dual_deck') return ctx.dualDeckCount;

    if (id.startsWith('answers_')) return ctx.totalAnswers;
    if (id === 'daily_50' || id === 'daily_100' || id === 'daily_200' || id === 'daily_500') {
      return ctx.maxDailyAnswers;
    }
    if (id === 'daily_categories_3') return ctx.maxDailyCategories;

    if (id.startsWith('ja_en_')) return stats.jaEnClears;
    if (id.startsWith('shuffle_')) return stats.shuffleClears;
    if (id === 'bookmark_first') return stats.everBookmarked || ctx.bookmarksLength > 0 ? 1 : 0;
    if (id === 'bookmark_revenge') return stats.bookmarkPerfectClears;
    if (id === 'bookmark_zero') return stats.bookmarkClearedToZero ? 1 : 0;
    if (id.startsWith('audio_')) return stats.audioPlayCount;
    if (id === 'never_give_up') return stats.resilientClears;

    if (id === 'secret_early_bird') return stats.earlyBirdCount;
    if (id === 'secret_night_owl') return stats.nightOwlCount;
    if (id === 'secret_comeback') return stats.comebackCount;
    if (id === 'secret_lucky_777' || id === 'secret_target_1900_ans') return ctx.totalAnswers;

    return 0;
  };

  const current = unlocked ? Math.max(badge.target, computeCurrent()) : computeCurrent();
  return {
    current,
    target: badge.target,
    unit: badge.unit,
    unlocked,
  };
}

/**
 * 現在の progress から未獲得バッジを判定・解放し、新規獲得分を返す
 */
export function evaluateBadges(progress: UserProgress): {
  progress: UserProgress;
  newlyUnlocked: BadgeDefinition[];
} {
  const ctx = createBadgeEvalContext(progress);
  const unlockedBadges: Record<string, BadgeRecord> = {
    ...(progress.unlockedBadges || {}),
  };
  const newlyUnlocked: BadgeDefinition[] = [];
  const nowIso = new Date().toISOString();

  for (const badge of BADGE_DEFINITIONS) {
    if (unlockedBadges[badge.id]) continue;
    const info = getBadgeProgress(badge, ctx);
    if (info.current >= badge.target) {
      unlockedBadges[badge.id] = { unlockedAt: nowIso };
      newlyUnlocked.push(badge);
    }
  }

  newlyUnlocked.sort(
    (a, b) => BADGE_TIER_META[a.tier].rankOrder - BADGE_TIER_META[b.tier].rankOrder
  );

  return {
    progress: {
      ...progress,
      unlockedBadges,
    },
    newlyUnlocked,
  };
}

/**
 * 旧バージョンからの初回マイグレーション時のみ履歴から遡及同期し、通常ロード時は構造正規化のみ行う
 */
export function migrateAndSyncBadges(
  rawProgress: UserProgress,
  runLegacyInference: boolean,
  targetVersion: number
): {
  progress: UserProgress;
  changed: boolean;
} {
  let changed = false;
  const stats: BadgeStats = {
    ...createEmptyBadgeStats(),
    ...(rawProgress.badgeStats || {}),
  };

  if (!rawProgress.badgeStats) {
    changed = true;
  }

  if (rawProgress.badgeMigrationVersion !== targetVersion) {
    changed = true;
  }

  if (runLegacyInference) {
    const studiedDates = getStudiedDates(rawProgress);
    const longestFromHistory = computeLongestStreakFromHistory(studiedDates);
    const bestStreak = Math.max(stats.maxStreakDays, rawProgress.streakDays, longestFromHistory);
    if (bestStreak !== stats.maxStreakDays) {
      stats.maxStreakDays = bestStreak;
      changed = true;
    }

    const clearedSet = new Set(stats.clearedCategories);
    const perfectSet = new Set(stats.perfectCategories);
    let maxDailyCats = stats.maxDailyCategories;
    let inferredPerfectCount = 0;

    for (const rec of Object.values(rawProgress.history || {})) {
      if (!rec || rec.totalAnswered <= 0) continue;
      if (rec.categories) {
        maxDailyCats = Math.max(maxDailyCats, rec.categories.length);
        for (const c of rec.categories) {
          if (!clearedSet.has(c)) {
            clearedSet.add(c);
            changed = true;
          }
        }
      }
      if (rec.categoryStats) {
        for (const [cat, stat] of Object.entries(rec.categoryStats)) {
          if (stat.correct + stat.incorrect > 0 && !clearedSet.has(cat)) {
            clearedSet.add(cat);
            changed = true;
          }
          if (stat.correct > 0 && stat.incorrect === 0) {
            inferredPerfectCount += 1;
            if (!perfectSet.has(cat)) {
              perfectSet.add(cat);
              changed = true;
            }
          }
        }
      }
    }

    if (maxDailyCats !== stats.maxDailyCategories) {
      stats.maxDailyCategories = maxDailyCats;
      changed = true;
    }
    if (stats.perfectSessions < inferredPerfectCount) {
      stats.perfectSessions = inferredPerfectCount;
      changed = true;
    }
    if (rawProgress.bookmarks.length > 0 && !stats.everBookmarked) {
      stats.everBookmarked = true;
      changed = true;
    }
    if (stats.comebackCount === 0 && hasHistoricalComeback(studiedDates)) {
      stats.comebackCount = 1;
      changed = true;
    }

    stats.clearedCategories = Array.from(clearedSet);
    stats.perfectCategories = Array.from(perfectSet);

    const migrated: UserProgress = {
      ...rawProgress,
      badgeStats: stats,
      unlockedBadges: rawProgress.unlockedBadges || {},
      soundEnabled: rawProgress.soundEnabled ?? true,
      badgeMigrationVersion: targetVersion,
    };

    const { progress: synced, newlyUnlocked } = evaluateBadges(migrated);
    if (newlyUnlocked.length > 0) {
      changed = true;
    }
    return { progress: synced, changed };
  }

  return {
    progress: {
      ...rawProgress,
      badgeStats: stats,
      unlockedBadges: rawProgress.unlockedBadges || {},
      soundEnabled: rawProgress.soundEnabled ?? true,
      badgeMigrationVersion: targetVersion,
    },
    changed,
  };
}
