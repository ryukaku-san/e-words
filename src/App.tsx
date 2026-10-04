import React, { useState } from 'react';
import { Header } from './components/Header';
import { CategorySelect } from './components/CategorySelect';
import { StudySession } from './components/StudySession';
import { StudyCalendar } from './components/StudyCalendar';
import { WordList } from './components/WordList';
import { LEARNING_ITEMS } from './data/learningItems';
import type { LearningItem, CategoryType } from './data/learningItems';
import {
  loadUserProgress,
  recordStudySession,
  toggleBookmarkItem,
} from './utils/storage';
import type { UserProgress } from './utils/storage';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [currentTab, setCurrentTab] = useState<'home' | 'calendar' | 'list'>('home');
  const [activeSession, setActiveSession] = useState<{
    items: LearningItem[];
    categoryTitle: string;
    direction: 'en-ja' | 'ja-en';
  } | null>(null);

  // ブックマークトグル
  const handleToggleBookmark = (id: string) => {
    const updatedBookmarks = toggleBookmarkItem(id);
    setProgress((prev) => ({ ...prev, bookmarks: updatedBookmarks }));
  };

  // 学習セッションの開始
  const handleStartCategory = (
    category: CategoryType,
    isShuffle: boolean,
    direction: 'en-ja' | 'ja-en',
    bookmarkOnly: boolean
  ) => {
    let pool: LearningItem[] = [];

    if (bookmarkOnly) {
      pool = LEARNING_ITEMS.filter((item) => progress.bookmarks.includes(item.id));
    } else if (category === 'all') {
      pool = [...LEARNING_ITEMS];
    } else {
      pool = LEARNING_ITEMS.filter((item) => item.category === category);
    }

    if (pool.length === 0) {
      alert('該当する問題がありません。');
      return;
    }

    let sessionItems = [...pool];
    if (isShuffle) {
      sessionItems = sessionItems.sort(() => Math.random() - 0.5);
    }

    let title = 'すべての項目';
    if (bookmarkOnly) {
      title = '苦手・ブックマーク問題';
    } else if (category === 'general_word') {
      title = '重要語彙';
    } else if (category === 'tech_word') {
      title = 'AI・技術専門用語';
    } else if (category === 'idiom') {
      title = '熟語・句動詞';
    } else if (category === 'grammar') {
      title = '英文法・構文';
    }

    setActiveSession({
      items: sessionItems,
      categoryTitle: title,
      direction,
    });
  };

  // セッション完了時のカレンダー記録
  const handleFinishSession = (correctCount: number, incorrectCount: number) => {
    if (!activeSession) return;
    const updated = recordStudySession(correctCount, incorrectCount, activeSession.categoryTitle);
    setProgress(updated);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-sans pb-10">
      {/* 共通ヘッダー */}
      <Header
        currentTab={activeSession ? 'home' : currentTab}
        onSelectTab={(tab) => {
          setActiveSession(null);
          setCurrentTab(tab);
        }}
      />

      {/* メインコンテンツエリア */}
      <main className="flex-1 w-full max-w-md mx-auto px-3 py-2 flex flex-col justify-start">
        {activeSession ? (
          <StudySession
            items={activeSession.items}
            categoryTitle={activeSession.categoryTitle}
            bookmarks={progress.bookmarks}
            direction={activeSession.direction}
            onToggleBookmark={handleToggleBookmark}
            onFinishSession={handleFinishSession}
            onBackToHome={() => setActiveSession(null)}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <CategorySelect
                onStartCategory={handleStartCategory}
                bookmarkCount={progress.bookmarks.length}
              />
            )}

            {currentTab === 'calendar' && (
              <StudyCalendar progress={progress} />
            )}

            {currentTab === 'list' && (
              <WordList
                bookmarks={progress.bookmarks}
                onToggleBookmark={handleToggleBookmark}
              />
            )}
          </>
        )}
      </main>

      {/* フッター */}
      <footer className="w-full max-w-md mx-auto text-center text-[11px] text-[var(--text-muted)] py-4 mt-auto">
        Based on Anthropic Engineering Blog &bull; PWA Ready
      </footer>
    </div>
  );
};

export default App;
