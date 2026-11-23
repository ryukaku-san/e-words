import type { BadgeDefinition } from '../data/badges';
import {
  createEmptyBadgeStats,
  evaluateBadges,
  migrateAndSyncBadges,
  parseDateKeyToUtcDays,
} from './badgeEvaluator';

export const BADGE_MIGRATION_VERSION = 1;

export interface DayStudyRecord {
  date: string; // "YYYY-MM-DD"
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  categories: string[];
  // カテゴリ別の内訳（範囲カードの最終学習日・正解率表示用。旧データには無い）
  categoryStats?: Record<string, { correct: number; incorrect: number }>;
}

export interface BadgeRecord {
  unlockedAt: string; // ISO string
}

export interface BadgeStats {
  maxStreakDays: number;
  perfectSessions: number;
  perfectShuffleSessions: number;
  perfectJaEnSessions: number;
  perfectHardcoreSessions: number;
  currentCorrectCombo: number;
  maxCorrectCombo: number;
  clearedCategories: string[];
  perfectCategories: string[];
  jaEnClears: number;
  shuffleClears: number;
  bookmarkPerfectClears: number;
  everBookmarked: boolean;
  bookmarkClearedToZero: boolean;
  audioPlayCount: number;
  resilientClears: number;
  earlyBirdCount: number;
  nightOwlCount: number;
  comebackCount: number;
  maxDailyCategories: number;
}

export interface SessionMeta {
  completed: boolean;
  direction: 'en-ja' | 'ja-en';
  isShuffle: boolean;
  bookmarkOnly: boolean;
  answerLog: boolean[];
  round1IncorrectCount: number;
}

export interface UserProgress {
  history: Record<string, DayStudyRecord>; // date -> record
  bookmarks: string[]; // item IDs
  lastStudiedDate: string | null;
  streakDays: number;
  unlockedBadges?: Record<string, BadgeRecord>;
  badgeStats?: BadgeStats;
  soundEnabled?: boolean;
  badgeMigrationVersion?: number;
}

const STORAGE_KEY = 'e_words_user_progress_v1';
const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toSafeNonNegInt(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function sanitizeUserProgress(raw: unknown): { progress: UserProgress; isLegacy: boolean } | null {
  if (!isPlainObject(raw)) return null;

  const history: Record<string, DayStudyRecord> = {};
  if (isPlainObject(raw.history)) {
    for (const [key, val] of Object.entries(raw.history)) {
      if (!isPlainObject(val)) continue;
      const dateStr = typeof val.date === 'string' && DATE_KEY_RE.test(val.date)
        ? val.date
        : DATE_KEY_RE.test(key)
          ? key
          : null;
      if (!dateStr) continue;

      let categoryStats: Record<string, { correct: number; incorrect: number }> | undefined;
      if (isPlainObject(val.categoryStats)) {
        categoryStats = {};
        for (const [cat, stat] of Object.entries(val.categoryStats)) {
          if (!isPlainObject(stat)) continue;
          categoryStats[cat] = {
            correct: toSafeNonNegInt(stat.correct),
            incorrect: toSafeNonNegInt(stat.incorrect),
          };
        }
      }

      history[dateStr] = {
        date: dateStr,
        totalAnswered: toSafeNonNegInt(val.totalAnswered),
        correctCount: toSafeNonNegInt(val.correctCount),
        incorrectCount: toSafeNonNegInt(val.incorrectCount),
        categories: toStringArray(val.categories),
        ...(categoryStats ? { categoryStats } : {}),
      };
    }
  }

  const bookmarks = toStringArray(raw.bookmarks);
  const lastStudiedDate =
    typeof raw.lastStudiedDate === 'string' && DATE_KEY_RE.test(raw.lastStudiedDate)
      ? raw.lastStudiedDate
      : null;
  const streakDays = toSafeNonNegInt(raw.streakDays);

  const unlockedBadges: Record<string, BadgeRecord> = {};
  if (isPlainObject(raw.unlockedBadges)) {
    for (const [badgeId, rec] of Object.entries(raw.unlockedBadges)) {
      if (isPlainObject(rec) && typeof rec.unlockedAt === 'string') {
        unlockedBadges[badgeId] = { unlockedAt: rec.unlockedAt };
      }
    }
  }

  const hasRawBadgeStats = isPlainObject(raw.badgeStats);
  const badgeMigrationVersion =
    typeof raw.badgeMigrationVersion === 'number' && Number.isFinite(raw.badgeMigrationVersion)
      ? raw.badgeMigrationVersion
      : undefined;

  const emptyStats = createEmptyBadgeStats();
  const rawStats = hasRawBadgeStats ? (raw.badgeStats as Record<string, unknown>) : {};
  const badgeStats: BadgeStats = {
    maxStreakDays: toSafeNonNegInt(rawStats.maxStreakDays ?? emptyStats.maxStreakDays),
    perfectSessions: toSafeNonNegInt(rawStats.perfectSessions ?? emptyStats.perfectSessions),
    perfectShuffleSessions: toSafeNonNegInt(rawStats.perfectShuffleSessions ?? emptyStats.perfectShuffleSessions),
    perfectJaEnSessions: toSafeNonNegInt(rawStats.perfectJaEnSessions ?? emptyStats.perfectJaEnSessions),
    perfectHardcoreSessions: toSafeNonNegInt(rawStats.perfectHardcoreSessions ?? emptyStats.perfectHardcoreSessions),
    currentCorrectCombo: toSafeNonNegInt(rawStats.currentCorrectCombo ?? emptyStats.currentCorrectCombo),
    maxCorrectCombo: toSafeNonNegInt(rawStats.maxCorrectCombo ?? emptyStats.maxCorrectCombo),
    clearedCategories: toStringArray(rawStats.clearedCategories),
    perfectCategories: toStringArray(rawStats.perfectCategories),
    jaEnClears: toSafeNonNegInt(rawStats.jaEnClears ?? emptyStats.jaEnClears),
    shuffleClears: toSafeNonNegInt(rawStats.shuffleClears ?? emptyStats.shuffleClears),
    bookmarkPerfectClears: toSafeNonNegInt(rawStats.bookmarkPerfectClears ?? emptyStats.bookmarkPerfectClears),
    everBookmarked: typeof rawStats.everBookmarked === 'boolean' ? rawStats.everBookmarked : emptyStats.everBookmarked,
    bookmarkClearedToZero:
      typeof rawStats.bookmarkClearedToZero === 'boolean'
        ? rawStats.bookmarkClearedToZero
        : emptyStats.bookmarkClearedToZero,
    audioPlayCount: toSafeNonNegInt(rawStats.audioPlayCount ?? emptyStats.audioPlayCount),
    resilientClears: toSafeNonNegInt(rawStats.resilientClears ?? emptyStats.resilientClears),
    earlyBirdCount: toSafeNonNegInt(rawStats.earlyBirdCount ?? emptyStats.earlyBirdCount),
    nightOwlCount: toSafeNonNegInt(rawStats.nightOwlCount ?? emptyStats.nightOwlCount),
    comebackCount: toSafeNonNegInt(rawStats.comebackCount ?? emptyStats.comebackCount),
    maxDailyCategories: toSafeNonNegInt(rawStats.maxDailyCategories ?? emptyStats.maxDailyCategories),
  };

  const soundEnabled = typeof raw.soundEnabled === 'boolean' ? raw.soundEnabled : true;
  const isLegacy = !hasRawBadgeStats && badgeMigrationVersion === undefined;

  return {
    progress: {
      history,
      bookmarks,
      lastStudiedDate,
      streakDays,
      unlockedBadges,
      badgeStats,
      soundEnabled,
      badgeMigrationVersion,
    },
    isLegacy,
  };
}

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadUserProgress(): UserProgress {
  let parsed: { progress: UserProgress; isLegacy: boolean } | null = null;
  let hadRawStorage = false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      hadRawStorage = true;
      parsed = sanitizeUserProgress(JSON.parse(raw));
    }
  } catch (e) {
    console.error('Failed to load user progress:', e);
  }

  if (!parsed) {
    return {
      history: {},
      bookmarks: [],
      lastStudiedDate: null,
      streakDays: 0,
      unlockedBadges: {},
      badgeStats: createEmptyBadgeStats(),
      soundEnabled: true,
      badgeMigrationVersion: BADGE_MIGRATION_VERSION,
    };
  }

  const { progress, changed } = migrateAndSyncBadges(
    parsed.progress,
    parsed.isLegacy,
    BADGE_MIGRATION_VERSION
  );
  if (changed && hadRawStorage) {
    saveUserProgress(progress);
  }
  return progress;
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
}

/**
 * 学習結果をカレンダー記録・ストリーク・バッジ統計に反映する
 */
export function recordStudySession(
  correctCount: number,
  incorrectCount: number,
  category: string,
  meta?: SessionMeta
): { progress: UserProgress; newlyUnlocked: BadgeDefinition[] } {
  const progress = loadUserProgress();
  const today = getTodayKey();
  const stats: BadgeStats = {
    ...createEmptyBadgeStats(),
    ...(progress.badgeStats || {}),
    clearedCategories: [...(progress.badgeStats?.clearedCategories || [])],
    perfectCategories: [...(progress.badgeStats?.perfectCategories || [])],
  };

  const prevRecord = progress.history[today] || {
    date: today,
    totalAnswered: 0,
    correctCount: 0,
    incorrectCount: 0,
    categories: [],
  };

  const updatedCategories = Array.from(new Set([...(prevRecord.categories || []), category]));
  const prevCatStat = prevRecord.categoryStats?.[category] || { correct: 0, incorrect: 0 };

  progress.history[today] = {
    date: today,
    totalAnswered: prevRecord.totalAnswered + correctCount + incorrectCount,
    correctCount: prevRecord.correctCount + correctCount,
    incorrectCount: prevRecord.incorrectCount + incorrectCount,
    categories: updatedCategories,
    categoryStats: {
      ...(prevRecord.categoryStats || {}),
      [category]: {
        correct: prevCatStat.correct + correctCount,
        incorrect: prevCatStat.incorrect + incorrectCount,
      },
    },
  };

  // ストリーク（連続日数）とカムバックの計算（UTC日数差でDSTズレを防止）
  if (progress.lastStudiedDate !== today) {
    if (progress.lastStudiedDate) {
      const diffDays = parseDateKeyToUtcDays(today) - parseDateKeyToUtcDays(progress.lastStudiedDate);
      if (diffDays === 1) {
        progress.streakDays += 1;
        progress.lastStudiedDate = today;
      } else if (diffDays > 1) {
        progress.streakDays = 1;
        if (diffDays >= 7) {
          stats.comebackCount += 1;
        }
        progress.lastStudiedDate = today;
      }
      // diffDays < 0（時計巻き戻しや西向きタイムゾーン移動）の場合は lastStudiedDate / streakDays を上書きしない
    } else {
      progress.streakDays = 1;
      progress.lastStudiedDate = today;
    }
  }

  stats.maxStreakDays = Math.max(stats.maxStreakDays, progress.streakDays);
  stats.maxDailyCategories = Math.max(stats.maxDailyCategories, updatedCategories.length);

  // 連続正解コンボの更新
  if (meta?.answerLog && meta.answerLog.length > 0) {
    let combo = stats.currentCorrectCombo;
    let maxCombo = stats.maxCorrectCombo;
    for (const ok of meta.answerLog) {
      if (ok) {
        combo += 1;
        if (combo > maxCombo) maxCombo = combo;
      } else {
        combo = 0;
      }
    }
    stats.currentCorrectCombo = combo;
    stats.maxCorrectCombo = maxCombo;
  }

  // セッション完走時の統計更新
  if (meta?.completed && correctCount + incorrectCount > 0) {
    if (!stats.clearedCategories.includes(category)) {
      stats.clearedCategories.push(category);
    }

    const isPerfect = incorrectCount === 0 && correctCount > 0;
    if (isPerfect) {
      stats.perfectSessions += 1;
      if (!stats.perfectCategories.includes(category)) {
        stats.perfectCategories.push(category);
      }
      if (meta.isShuffle) {
        stats.perfectShuffleSessions += 1;
      }
      if (meta.direction === 'ja-en') {
        stats.perfectJaEnSessions += 1;
      }
      if (meta.isShuffle && meta.direction === 'ja-en') {
        stats.perfectHardcoreSessions += 1;
      }
      if (meta.bookmarkOnly) {
        stats.bookmarkPerfectClears += 1;
      }
    }

    if (meta.direction === 'ja-en') {
      stats.jaEnClears += 1;
    }
    if (meta.isShuffle) {
      stats.shuffleClears += 1;
    }
    if (meta.round1IncorrectCount >= 5) {
      stats.resilientClears += 1;
    }

    const hour = new Date().getHours();
    if (hour >= 5 && hour <= 7) {
      stats.earlyBirdCount += 1;
    } else if (hour >= 0 && hour <= 3) {
      stats.nightOwlCount += 1;
    }
  }

  progress.badgeStats = stats;

  const { progress: evaluated, newlyUnlocked } = evaluateBadges(progress);
  saveUserProgress(evaluated);
  return { progress: evaluated, newlyUnlocked };
}

export function toggleBookmarkItem(itemId: string): {
  progress: UserProgress;
  newlyUnlocked: BadgeDefinition[];
} {
  const progress = loadUserProgress();
  const stats: BadgeStats = {
    ...createEmptyBadgeStats(),
    ...(progress.badgeStats || {}),
  };

  if (progress.bookmarks.length > 0) {
    stats.everBookmarked = true;
  }

  const index = progress.bookmarks.indexOf(itemId);
  if (index >= 0) {
    progress.bookmarks.splice(index, 1);
    if (stats.everBookmarked && progress.bookmarks.length === 0) {
      stats.bookmarkClearedToZero = true;
    }
  } else {
    progress.bookmarks.push(itemId);
    stats.everBookmarked = true;
  }

  progress.badgeStats = stats;
  const { progress: evaluated, newlyUnlocked } = evaluateBadges(progress);
  saveUserProgress(evaluated);
  return { progress: evaluated, newlyUnlocked };
}

export function recordAudioPlay(): {
  progress: UserProgress;
  newlyUnlocked: BadgeDefinition[];
} {
  const progress = loadUserProgress();
  const stats: BadgeStats = {
    ...createEmptyBadgeStats(),
    ...(progress.badgeStats || {}),
  };
  stats.audioPlayCount += 1;
  progress.badgeStats = stats;

  const { progress: evaluated, newlyUnlocked } = evaluateBadges(progress);
  saveUserProgress(evaluated);
  return { progress: evaluated, newlyUnlocked };
}

export function setSoundEnabled(enabled: boolean): UserProgress {
  const progress = loadUserProgress();
  const updated: UserProgress = {
    ...progress,
    soundEnabled: enabled,
  };
  saveUserProgress(updated);
  return updated;
}
