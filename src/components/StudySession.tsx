import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw, Check, X, Star, Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';
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
  direction?: 'en-ja' | 'ja-en'; // 出題方向
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
  // セッション内の状態
  const [currentRoundItems, setCurrentRoundItems] = useState<LearningItem[]>(items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // 1周目の不正解リスト（復習用）
  const [incorrectItems, setIncorrectItems] = useState<LearningItem[]>([]);
  const [isReviewRound, setIsReviewRound] = useState(false);

  // 全体統計
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalIncorrect, setTotalIncorrect] = useState(0);

  // セッション完了状態
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = currentRoundItems[currentIndex];
  const isBookmarked = currentItem ? bookmarks.includes(currentItem.id) : false;

  // カードが切り替わったら自動めくり状態をリセット
  useEffect(() => {
    setIsRevealed(false);
  }, [currentIndex, isReviewRound]);

  // 音声読み上げ
  const handlePlayVoice = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlayingAudio(true);
    speakEnglish(text, () => {
      setIsPlayingAudio(false);
    });
  };

  // 回答判定（正解 / 不正解）
  const handleAnswer = (isCorrect: boolean) => {
    if (!currentItem) return;

    if (isCorrect) {
      setTotalCorrect((prev) => prev + 1);
    } else {
      setTotalIncorrect((prev) => prev + 1);
      if (!isReviewRound) {
        // 1周目で不正解だったアイテムを記録
        setIncorrectItems((prev) => [...prev, currentItem]);
      }
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < currentRoundItems.length) {
      setCurrentIndex(nextIndex);
    } else {
      // 現在の周が終了
      if (!isReviewRound && incorrectItems.length + (isCorrect ? 0 : 1) > 0) {
        // 1回だけ不正解だった問題をもう一周行う
        const itemsToReview = isCorrect ? incorrectItems : [...incorrectItems, currentItem];
        setIsReviewRound(true);
        setCurrentRoundItems(itemsToReview);
        setCurrentIndex(0);
      } else {
        // 2周目完了、あるいは1周目で全問正解！
        finishSession(
          totalCorrect + (isCorrect ? 1 : 0),
          totalIncorrect + (isCorrect ? 0 : 1)
        );
      }
    }
  };

  // 完了時の処理
  const finishSession = (finalCorrect: number, finalIncorrect: number) => {
    setIsFinished(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // confetti失敗時は無視
    }
    onFinishSession(finalCorrect, finalIncorrect);
  };

  if (isFinished) {
    const accuracy =
      totalCorrect + totalIncorrect > 0
        ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
        : 100;

    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--card-shadow)] text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-500">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-[var(--text-main)] mb-1">学習完了！お疲れ様でした</h2>
          <p className="text-sm text-[var(--text-muted)]">
            カレンダーに学習記録（丸）が記録されました。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[var(--bg-muted)]">
          <div className="text-center">
            <div className="text-xs text-[var(--text-muted)] mb-1">正解数</div>
            <div className="text-2xl font-black text-emerald-500">{totalCorrect} 問</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[var(--text-muted)] mb-1">正答率</div>
            <div className="text-2xl font-black text-[var(--primary)]">{accuracy}%</div>
          </div>
        </div>

        <button
          onClick={onBackToHome}
          className="w-full py-3.5 px-4 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-base transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>カテゴリ選択に戻る</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="text-center p-8 text-[var(--text-muted)]">
        問題が見つかりませんでした。
        <button onClick={onBackToHome} className="block mx-auto mt-4 text-[var(--primary)] underline">
          ホームへ戻る
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / currentRoundItems.length) * 100);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* 上部ヘッダー & プログレスバー */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">{categoryTitle}</span>
            {isReviewRound && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 text-[11px] font-bold border border-amber-500/30 flex items-center gap-1">
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
        <div className="w-full h-2 rounded-full bg-[var(--bg-muted)] overflow-hidden">
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
        className={`w-full min-h-[380px] p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--card-shadow)] flex flex-col justify-between cursor-pointer transition-all duration-300 relative select-none ${
          !isRevealed ? 'hover:border-[var(--primary)]' : ''
        }`}
      >
        {/* カード上部アクション（ブックマーク & 音声 & カテゴリタグ） */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-muted)] text-xs font-medium text-[var(--text-muted)]">
            {currentItem.pos || (currentItem.category === 'grammar' ? '構文' : '表現')}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handlePlayVoice(currentItem.term, e)}
              className={`p-2 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--primary-light)] text-[var(--text-muted)] hover:text-[var(--primary)] transition ${
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
              className={`p-2 rounded-xl bg-[var(--bg-muted)] transition ${
                isBookmarked ? 'text-amber-500 fill-amber-500' : 'text-[var(--text-muted)] hover:text-amber-400'
              }`}
              title="お気に入り・苦手登録"
              aria-label="ブックマーク"
            >
              <Star className={`w-5 h-5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* 表面 / メイン表示 */}
        <div className="my-auto py-4 text-center">
          {direction === 'en-ja' ? (
            <div>
              <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight leading-snug">
                {currentItem.term}
              </h2>
              {currentItem.structure && (
                <div className="mt-3 inline-block px-3 py-1 rounded-xl bg-[var(--bg-muted)] text-xs font-mono text-[var(--accent)] font-semibold">
                  {currentItem.structure}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">意味・日本語</div>
              <h2 className="text-2xl font-bold text-[var(--text-main)] leading-snug">
                {currentItem.meaning}
              </h2>
            </div>
          )}

          {!isRevealed && (
            <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)] animate-pulse">
              <Layers className="w-4 h-4" />
              <span>カードをタップして回答・解説・例文を表示</span>
            </div>
          )}
        </div>

        {/* 裏面（タップで回答・解説・サンプル英文を表示） */}
        {isRevealed && (
          <div className="pt-4 border-t border-[var(--border-color)] space-y-3 animate-in fade-in duration-200">
            {/* 意味 */}
            <div>
              <div className="text-xs font-semibold text-[var(--text-muted)] mb-0.5">意味・ニュアンス</div>
              <div className="text-base font-bold text-[var(--text-main)]">
                {currentItem.meaning}
              </div>
            </div>

            {/* 本文での使われ方 / 解説 */}
            {(currentItem.usage || currentItem.explanation) && (
              <div className="p-3 rounded-xl bg-[var(--bg-muted)] text-xs text-[var(--text-muted)] leading-relaxed">
                <span className="font-semibold text-[var(--text-main)] block mb-1">
                  {currentItem.category === 'grammar' ? '💡 文法解説:' : '📖 文脈での使われ方:'}
                </span>
                {currentItem.explanation || currentItem.usage}
              </div>
            )}

            {/* サンプル英文 */}
            {currentItem.example && (
              <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--primary)]">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    サンプル英文
                  </span>
                  <button
                    onClick={(e) => handlePlayVoice(currentItem.example, e)}
                    className="p-1 hover:text-[var(--primary-hover)] cursor-pointer"
                    title="例文を発音"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs font-medium text-[var(--text-main)] leading-relaxed">
                  {currentItem.example}
                </p>
                {currentItem.exampleJa && (
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {currentItem.exampleJa}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 回答・判定ボタンエリア */}
      {isRevealed ? (
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* 不正解判定ボタン */}
          <button
            onClick={() => handleAnswer(false)}
            className="py-3.5 px-4 rounded-2xl border-2 border-red-400/50 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
            <span>もう一度 (不正解)</span>
          </button>

          {/* 正解判定ボタン */}
          <button
            onClick={() => handleAnswer(true)}
            className="py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>覚えた (正解)</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsRevealed(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
        >
          <span>タップして回答を見る</span>
        </button>
      )}

      {/* キーボードショートカットガイド（PC対応） */}
      <div className="text-center text-[10px] text-[var(--text-muted)] pt-1">
        PC操作: [Space] 回答を開く / [← 1] 不正解 / [→ 2] 正解
      </div>
    </div>
  );
};
