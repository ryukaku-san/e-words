import React, { useState } from 'react';
import { Header } from './components/Header';
import { CategorySelect } from './components/CategorySelect';
import { StudySession } from './components/StudySession';
import { StudyCalendar } from './components/StudyCalendar';
import { WordList } from './components/WordList';
import { TopPage } from './components/TopPage';
import { TargetRangeSelect } from './components/TargetRangeSelect';
import type { TargetRange } from './components/TargetRangeSelect';
import { LEARNING_ITEMS } from './data/learningItems';
import type { LearningItem, CategoryType } from './data/learningItems';
import { TARGET1900_ITEMS } from './data/target1900';
import {
  loadUserProgress,
  recordStudySession,
  toggleBookmarkItem,
} from './utils/storage';
import type { UserProgress } from './utils/storage';

type DeckType = 'article' | 'target1900';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [page, setPage] = useState<'top' | 'deck'>('top');
  const [deck, setDeck] = useState<DeckType>('article');
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

  // トップページで教材を選択
  const handleSelectDeck = (d: DeckType) => {
    setDeck(d);
    setActiveSession(null);
    setCurrentTab('home');
    setPage('deck');
  };

  // ターゲット1900の範囲学習を開始
  const handleStartTargetRange = (
    range: TargetRange | null,
    isShuffle: boolean,
    direction: 'en-ja' | 'ja-en',
    bookmarkOnly: boolean
  ) => {
    let pool: LearningItem[] = [];
    let title = '';

    if (bookmarkOnly) {
      pool = TARGET1900_ITEMS.filter((item) => progress.bookmarks.includes(item.id));
      title = 'ターゲット1900 苦手・ブックマーク';
    } else if (range) {
      pool = TARGET1900_ITEMS.slice(range.startNo - 1, range.endNo);
      title = `ターゲット1900 No.${range.startNo}–${range.endNo}`;
    }

    if (pool.length === 0) {
      alert('該当する問題がありません。');
      return;
    }

    let sessionItems = [...pool];
    if (isShuffle) {
      sessionItems = sessionItems.sort(() => Math.random() - 0.5);
    }

    setActiveSession({
      items: sessionItems,
      categoryTitle: title,
      direction,
    });
  };

  const articleBookmarkCount = LEARNING_ITEMS.filter((item) =>
    progress.bookmarks.includes(item.id)
  ).length;
  const targetBookmarkCount = TARGET1900_ITEMS.filter((item) =>
    progress.bookmarks.includes(item.id)
  ).length;

  // セッション完了時のカレンダー記録
  const handleFinishSession = (correctCount: number, incorrectCount: number) => {
    if (!activeSession) return;
    const updated = recordStudySession(correctCount, incorrectCount, activeSession.categoryTitle);
    setProgress(updated);
  };

  // 途中でやめた時のカレンダー記録（1問以上解いていれば、そこまでの分を残す）
  const handleQuitSession = (correctCount: number, incorrectCount: number) => {
    if (!activeSession) return;
    if (correctCount + incorrectCount > 0) {
      const updated = recordStudySession(correctCount, incorrectCount, activeSession.categoryTitle);
      setProgress(updated);
    }
    setActiveSession(null);
  };

  // トップページ（教材選択）
  if (page === 'top') {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-sans pb-10">
        <main className="flex-1 w-full max-w-md mx-auto px-3 py-2 flex flex-col justify-start">
          <TopPage onSelectDeck={handleSelectDeck} />
        </main>
        <footer className="w-full max-w-md mx-auto text-center text-[11px] text-[var(--text-muted)] py-4 mt-auto">
          E-Words &bull; PWA Ready
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-sans pb-10">
      {/* 共通ヘッダー */}
      <Header
        currentTab={activeSession ? 'home' : currentTab}
        onSelectTab={(tab) => {
          setActiveSession(null);
          setCurrentTab(tab);
        }}
        deckLabel={deck === 'target1900' ? 'ターゲット1900' : '英語記事タイトル'}
        onGoTop={() => {
          setActiveSession(null);
          setPage('top');
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
            onQuitSession={handleQuitSession}
            onBackToHome={() => setActiveSession(null)}
          />
        ) : (
          <>
            {currentTab === 'home' &&
              (deck === 'target1900' ? (
                <TargetRangeSelect
                  onStartRange={handleStartTargetRange}
                  bookmarkCount={targetBookmarkCount}
                />
              ) : (
                <CategorySelect
                  onStartCategory={handleStartCategory}
                  bookmarkCount={articleBookmarkCount}
                />
              ))}

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
        E-Words &bull; PWA Ready
      </footer>
    </div>
  );
};

export default App;
