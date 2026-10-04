export interface DayStudyRecord {
  date: string; // "YYYY-MM-DD"
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  categories: string[];
}

export interface UserProgress {
  history: Record<string, DayStudyRecord>; // date -> record
  bookmarks: string[]; // item IDs
  lastStudiedDate: string | null;
  streakDays: number;
}

const STORAGE_KEY = 'e_words_user_progress_v1';

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load user progress:', e);
  }

  return {
    history: {},
    bookmarks: [],
    lastStudiedDate: null,
    streakDays: 0,
  };
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
}

/**
 * 学習結果をカレンダー記録に反映し、ストリーク日数を更新する
 */
export function recordStudySession(
  correctCount: number,
  incorrectCount: number,
  category: string
): UserProgress {
  const progress = loadUserProgress();
  const today = getTodayKey();

  const prevRecord = progress.history[today] || {
    date: today,
    totalAnswered: 0,
    correctCount: 0,
    incorrectCount: 0,
    categories: [],
  };

  const updatedCategories = Array.from(new Set([...prevRecord.categories, category]));

  progress.history[today] = {
    date: today,
    totalAnswered: prevRecord.totalAnswered + correctCount + incorrectCount,
    correctCount: prevRecord.correctCount + correctCount,
    incorrectCount: prevRecord.incorrectCount + incorrectCount,
    categories: updatedCategories,
  };

  // ストリーク（連続日数）の計算
  if (progress.lastStudiedDate !== today) {
    if (progress.lastStudiedDate) {
      const last = new Date(progress.lastStudiedDate);
      const cur = new Date(today);
      const diffDays = Math.round((cur.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        progress.streakDays += 1;
      } else if (diffDays > 1) {
        progress.streakDays = 1;
      }
    } else {
      progress.streakDays = 1;
    }
    progress.lastStudiedDate = today;
  }

  saveUserProgress(progress);
  return progress;
}

export function toggleBookmarkItem(itemId: string): string[] {
  const progress = loadUserProgress();
  const index = progress.bookmarks.indexOf(itemId);
  if (index >= 0) {
    progress.bookmarks.splice(index, 1);
  } else {
    progress.bookmarks.push(itemId);
  }
  saveUserProgress(progress);
  return progress.bookmarks;
}
