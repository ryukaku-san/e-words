import React, { useState } from 'react';
import { Header } from './components/Header';
import { CategorySelect } from './components/CategorySelect';
import { StudySession } from './components/StudySession';
import type { SessionCompletionStats } from './components/StudySession';
import { StudyCalendar } from './components/StudyCalendar';
import { WordList } from './components/WordList';
import { TopPage } from './components/TopPage';
import { TargetRangeSelect } from './components/TargetRangeSelect';
import type { TargetRange } from './components/TargetRangeSelect';
import { BadgeUnlockModal } from './components/BadgeUnlockModal';
import { BadgeDetailModal } from './components/BadgeDetailModal';
import { LEARNING_ITEMS } from './data/learningItems';
import type { LearningItem, CategoryType } from './data/learningItems';
import { TARGET1900_ITEMS } from './data/target1900';
import { BADGE_TIER_META } from './data/badges';
import type { BadgeDefinition } from './data/badges';
import { unlockAudioContext } from './utils/sound';
import {
  loadUserProgress,
  recordAudioPlay,
  recordStudySession,
  setSoundEnabled,
  toggleBookmarkItem,
} from './utils/storage';
import type { UserProgress } from './utils/storage';

type DeckType = 'article' | 'target1900';

function mergeUniqueBadges(
  existing: BadgeDefinition[],
  incoming: BadgeDefinition[]
): BadgeDefinition[] {
  if (incoming.length === 0) return existing;
  const seen = new Set(existing.map((b) => b.id));
  const merged = [...existing];
  for (const b of incoming) {
    if (!seen.has(b.id)) {
      seen.add(b.id);
      merged.push(b);
    }
  }
  merged.sort((a, b) => BADGE_TIER_META[a.tier].rankOrder - BADGE_TIER_META[b.tier].rankOrder);
  return merged;
}

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());
  const [page, setPage] = useState<'top' | 'deck'>('top');
  const [topTab, setTopTab] = useState<'decks' | 'badges'>('decks');
  const [deck, setDeck] = useState<DeckType>('article');
  const [currentTab, setCurrentTab] = useState<'home' | 'calendar' | 'list'>('home');
  const [activeSession, setActiveSession] = useState<{
    items: LearningItem[];
    categoryTitle: string;
    direction: 'en-ja' | 'ja-en';
    isShuffle: boolean;
    bookmarkOnly: boolean;
  } | null>(null);

  const [unlockQueue, setUnlockQueue] = useState<BadgeDefinition[]>([]);
  const [pendingSessionBadges, setPendingSessionBadges] = useState<BadgeDefinition[]>([]);
  const [sessionCompletedBadges, setSessionCompletedBadges] = useState<BadgeDefinition[]>([]);
  const [inspectedSessionBadge, setInspectedSessionBadge] = useState<BadgeDefinition | null>(null);

  const triggerUnlockModal = (badges: BadgeDefinition[]) => {
    if (badges.length === 0) return;
    setUnlockQueue((prev) => mergeUniqueBadges(prev, badges));
  };

  const queueOrShowUnlocks = (newlyUnlocked: BadgeDefinition[], deferIfStudying: boolean) => {
    if (newlyUnlocked.length === 0) return;
    if (deferIfStudying && activeSession) {
      setPendingSessionBadges((prev) => mergeUniqueBadges(prev, newlyUnlocked));
    } else {
      triggerUnlockModal(newlyUnlocked);
    }
  };

  const leaveSessionAndFlushBadges = () => {
    if (pendingSessionBadges.length > 0) {
      triggerUnlockModal(pendingSessionBadges);
      setPendingSessionBadges([]);
    }
    setActiveSession(null);
  };

  // ブックマークトグル
  const handleToggleBookmark = (id: string) => {
    unlockAudioContext();
    const { progress: updated, newlyUnlocked } = toggleBookmarkItem(id);
    setProgress(updated);
    queueOrShowUnlocks(newlyUnlocked, true);
  };

  // 発音再生カウント
  const handleAudioPlay = () => {
    unlockAudioContext();
    const { progress: updated, newlyUnlocked } = recordAudioPlay();
    setProgress(updated);
    queueOrShowUnlocks(newlyUnlocked, true);
  };

  // 効果音ON/OFF切替
  const handleToggleSound = () => {
    unlockAudioContext();
    const nextEnabled = !(progress.soundEnabled ?? true);
    const updated = setSoundEnabled(nextEnabled);
    setProgress(updated);
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

    setPendingSessionBadges([]);
    setSessionCompletedBadges([]);
    setActiveSession({
      items: sessionItems,
      categoryTitle: title,
      direction,
      isShuffle,
      bookmarkOnly,
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

    setPendingSessionBadges([]);
    setSessionCompletedBadges([]);
    setActiveSession({
      items: sessionItems,
      categoryTitle: title,
      direction,
      isShuffle,
      bookmarkOnly,
    });
  };

  const articleBookmarkCount = LEARNING_ITEMS.filter((item) =>
    progress.bookmarks.includes(item.id)
  ).length;
  const targetBookmarkCount = TARGET1900_ITEMS.filter((item) =>
    progress.bookmarks.includes(item.id)
  ).length;

  // 範囲ごとの最終学習日と、その日の正解率（範囲カード表示用）
  const rangeStats: Record<string, { lastDate: string; accuracy: number }> = {};
  for (const record of Object.values(progress.history)) {
    if (!record.categoryStats) continue;
    for (const [category, stat] of Object.entries(record.categoryStats)) {
      const total = stat.correct + stat.incorrect;
      if (total === 0) continue;
      const current = rangeStats[category];
      if (!current || record.date > current.lastDate) {
        rangeStats[category] = {
          lastDate: record.date,
          accuracy: Math.round((stat.correct / total) * 100),
        };
      }
    }
  }

  // セッション完了時のカレンダー・バッジ記録
  const handleFinishSession = (
    correctCount: number,
    incorrectCount: number,
    stats: SessionCompletionStats
  ) => {
    if (!activeSession) return;
    const { progress: updated, newlyUnlocked } = recordStudySession(
      correctCount,
      incorrectCount,
      activeSession.categoryTitle,
      {
        completed: true,
        direction: activeSession.direction,
        isShuffle: activeSession.isShuffle,
        bookmarkOnly: activeSession.bookmarkOnly,
        answerLog: stats.answerLog,
        round1IncorrectCount: stats.round1IncorrectCount,
      }
    );
    setProgress(updated);

    const combined = mergeUniqueBadges(pendingSessionBadges, newlyUnlocked);
    setPendingSessionBadges([]);
    setSessionCompletedBadges(combined);
    triggerUnlockModal(combined);
  };

  // 途中でやめた時のカレンダー・バッジ記録（1問以上解いていれば、そこまでの分を残す）
  const handleQuitSession = (
    correctCount: number,
    incorrectCount: number,
    stats: SessionCompletionStats
  ) => {
    if (!activeSession) return;
    let combined = [...pendingSessionBadges];
    if (correctCount + incorrectCount > 0) {
      const { progress: updated, newlyUnlocked } = recordStudySession(
        correctCount,
        incorrectCount,
        activeSession.categoryTitle,
        {
          completed: false,
          direction: activeSession.direction,
          isShuffle: activeSession.isShuffle,
          bookmarkOnly: activeSession.bookmarkOnly,
          answerLog: stats.answerLog,
          round1IncorrectCount: stats.round1IncorrectCount,
        }
      );
      setProgress(updated);
      combined = mergeUniqueBadges(combined, newlyUnlocked);
    }
    setPendingSessionBadges([]);
    setActiveSession(null);
    triggerUnlockModal(combined);
  };

  const soundEnabled = progress.soundEnabled ?? true;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-sans pb-10">
      {page === 'top' ? (
        <main className="flex-1 w-full max-w-md mx-auto px-3 py-2 flex flex-col justify-start">
          <TopPage
            onSelectDeck={handleSelectDeck}
            progress={progress}
            onToggleSound={handleToggleSound}
            activeTab={topTab}
            onChangeTab={setTopTab}
          />
        </main>
      ) : (
        <>
          {/* 共通ヘッダー */}
          <Header
            currentTab={activeSession ? 'home' : currentTab}
            onSelectTab={(tab) => {
              leaveSessionAndFlushBadges();
              setCurrentTab(tab);
            }}
            deckLabel={deck === 'target1900' ? 'ターゲット1900' : '英語記事タイトル'}
            onGoTop={() => {
              leaveSessionAndFlushBadges();
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
                onAudioPlay={handleAudioPlay}
                onFinishSession={handleFinishSession}
                onQuitSession={handleQuitSession}
                onBackToHome={leaveSessionAndFlushBadges}
                sessionUnlockedBadges={sessionCompletedBadges}
                onInspectBadge={setInspectedSessionBadge}
              />
            ) : (
              <>
                {currentTab === 'home' &&
                  (deck === 'target1900' ? (
                    <TargetRangeSelect
                      onStartRange={handleStartTargetRange}
                      bookmarkCount={targetBookmarkCount}
                      rangeStats={rangeStats}
                    />
                  ) : (
                    <CategorySelect
                      onStartCategory={handleStartCategory}
                      bookmarkCount={articleBookmarkCount}
                    />
                  ))}

                {currentTab === 'calendar' && <StudyCalendar progress={progress} />}

                {currentTab === 'list' && (
                  <WordList
                    bookmarks={progress.bookmarks}
                    onToggleBookmark={handleToggleBookmark}
                    onAudioPlay={handleAudioPlay}
                  />
                )}
              </>
            )}
          </main>
        </>
      )}

      {/* フッター */}
      <footer className="w-full max-w-md mx-auto text-center text-[11px] text-[var(--text-muted)] py-4 mt-auto">
        E-Words &bull; PWA Ready
      </footer>

      {/* バッジ獲得演出モーダル（Top-Layer） */}
      {unlockQueue.length > 0 && (
        <BadgeUnlockModal
          badges={unlockQueue}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onClose={() => setUnlockQueue([])}
        />
      )}

      {/* セッション完了画面からのバッジ詳細モーダル */}
      <BadgeDetailModal
        badge={inspectedSessionBadge}
        progress={progress}
        onClose={() => setInspectedSessionBadge(null)}
      />
    </div>
  );
};

export default App;
