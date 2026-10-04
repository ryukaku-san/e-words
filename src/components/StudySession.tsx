import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw, Check, X, Star, Sparkles, ArrowRight, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { LearningItem } from '../data/learningItems';
import { speakEnglish } from '../utils/speech';

interface StudySessionProps {
  items: LearningItem[];
  categoryTitle: string;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onFinishSession: (correctCount: number, incorrectCount: number) => void;
  onBackToHome: () => void;
  direction?: 'en-ja' | 'ja-en';
}

export const StudySession: React.FC<StudySessionProps> = ({
  items,
  categoryTitle,
  bookmarks,
  onToggleBookmark,
  onFinishSession,
  onBackToHome,
  direction = 'en-ja',
}) => {
  const [currentRoundItems, setCurrentRoundItems] = useState<LearningItem[]>(items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // 1周目の不正解リスト（復習用）
  const [incorrectItems, setIncorrectItems] = useState<LearningItem[]>([]);
  const [isReviewRound, setIsReviewRound] = useState(false);

  // 正解・不正解の統計
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalIncorrect, setTotalIncorrect] = useState(0);

  // 完了フラグ
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = currentRoundItems[currentIndex];
  const isBookmarked = currentItem ? bookmarks.includes(currentItem.id) : false;

  useEffect(() => {
    setIsRevealed(false);
  }, [currentIndex, isReviewRound]);

  const handlePlayVoice = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlayingAudio(true);
    speakEnglish(text, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentItem) return;

    if (isCorrect) {
      setTotalCorrect((prev) => prev + 1);
    } else {
      setTotalIncorrect((prev) => prev + 1);
      if (!isReviewRound) {
        setIncorrectItems((prev) => [...prev, currentItem]);
      }
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < currentRoundItems.length) {
      setCurrentIndex(nextIndex);
    } else {
      // 1周目終了判定
      if (!isReviewRound && incorrectItems.length + (isCorrect ? 0 : 1) > 0) {
        const itemsToReview = isCorrect ? incorrectItems : [...incorrectItems, currentItem];
        setIsReviewRound(true);
        setCurrentRoundItems(itemsToReview);
        setCurrentIndex(0);
      } else {
        // 全問終了
        finishSession(
          totalCorrect + (isCorrect ? 1 : 0),
          totalIncorrect + (isCorrect ? 0 : 1)
        );
      }
    }
  };

  const finishSession = (finalCorrect: number, finalIncorrect: number) => {
    setIsFinished(true);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    onFinishSession(finalCorrect, finalIncorrect);
  };

  if (isFinished) {
    const accuracy =
      totalCorrect + totalIncorrect > 0
        ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
        : 100;

    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--card-shadow)] text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1">学習完了！</h2>
          <p className="text-sm text-[var(--text-muted)]">
            カレンダーに丸（学習記録）がつきました。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[var(--bg-muted)]">
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-1">正解数</div>
            <div className="text-2xl font-bold text-emerald-600">{totalCorrect} 問</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-1">正答率</div>
            <div className="text-2xl font-bold text-[var(--primary)]">{accuracy}%</div>
          </div>
        </div>

        <button
          onClick={onBackToHome}
          className="w-full py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-base transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <span>一覧・選択に戻る</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="text-center p-8 text-[var(--text-muted)]">
        問題がありません。
        <button onClick={onBackToHome} className="block mx-auto mt-4 text-[var(--primary)] underline">
          ホームへ戻る
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / currentRoundItems.length) * 100);

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* 上部ヘッダー & プログレスバー */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">{categoryTitle}</span>
            {isReviewRound && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                復習モード（2周目）
              </span>
            )}
          </div>
          <span className="text-[var(--text-muted)]">
            {currentIndex + 1} / {currentRoundItems.length}
          </span>
        </div>

        {/* 進捗バー */}
        <div className="w-full h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isReviewRound ? 'bg-amber-500' : 'bg-[var(--primary)]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* フラッシュカード本体 */}
      <div
        onClick={() => setIsRevealed(!isRevealed)}
        className="w-full min-h-[340px] p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--card-shadow)] flex flex-col justify-between cursor-pointer transition select-none"
      >
        {/* 上部アクション（品詞 & 音声 & お気に入り） */}
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-xs font-medium text-[var(--text-muted)]">
            {currentItem.pos || (currentItem.category === 'grammar' ? '構文' : '表現')}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => handlePlayVoice(currentItem.term, e)}
              className={`p-2 rounded-lg bg-[var(--bg-muted)] hover:bg-[var(--primary-light)] text-[var(--text-muted)] hover:text-[var(--primary)] transition ${
                isPlayingAudio ? 'animate-pulse text-[var(--primary)]' : ''
              }`}
              title="英語を発音"
              aria-label="発音を聞く"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(currentItem.id);
              }}
              className="p-2 rounded-lg bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-amber-500 transition"
              title="ブックマーク"
              aria-label="ブックマーク"
            >
              <Star className={`w-5 h-5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* 表面表示 */}
        <div className="my-auto py-3 text-center">
          {direction === 'en-ja' ? (
            <div>
              <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight">
                {currentItem.term}
              </h2>
              {currentItem.structure && (
                <div className="mt-2.5 inline-block px-3 py-1 rounded-lg bg-[var(--bg-muted)] text-xs font-mono text-[var(--primary)] font-semibold">
                  {currentItem.structure}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="text-xs text-[var(--text-muted)] mb-1">意味・日本語</div>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">
                {currentItem.meaning}
              </h2>
            </div>
          )}

          {!isRevealed && (
            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Layers className="w-4 h-4" />
              <span>タップで回答と語源を表示</span>
            </div>
          )}
        </div>

        {/* 裏面（タップで回答・解説・語源を表示） */}
        {isRevealed && (
          <div className="pt-3 border-t border-[var(--border-color)] space-y-2.5 text-left animate-in fade-in duration-150">
            {/* 意味 */}
            <div>
              <div className="text-xs font-semibold text-[var(--text-muted)]">意味・ニュアンス</div>
              <div className="text-base font-bold text-[var(--text-main)]">
                {currentItem.meaning}
              </div>
            </div>

            {/* 語源・成り立ち（例文の代わりに記憶定着を促進） */}
            {currentItem.etymology && (
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs leading-relaxed text-slate-700">
                <span className="font-bold text-blue-900 block mb-0.5">🌱 語源・成り立ち</span>
                {currentItem.etymology}
              </div>
            )}

            {/* 本文での使われ方 / 解説 */}
            {(currentItem.usage || currentItem.explanation) && (
              <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                <span className="font-semibold text-[var(--text-main)]">
                  {currentItem.category === 'grammar' ? '💡 解説: ' : '📖 文脈: '}
                </span>
                {currentItem.explanation || currentItem.usage}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 判定ボタン */}
      {isRevealed ? (
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => handleAnswer(false)}
            className="py-3 px-4 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
            <span>もう一度 (不正解)</span>
          </button>

          <button
            onClick={() => handleAnswer(true)}
            className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>覚えた (正解)</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsRevealed(true)}
          className="w-full py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
        >
          <span>タップして回答を見る</span>
        </button>
      )}
    </div>
  );
};
