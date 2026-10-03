import React, { useState } from 'react';
import { BookOpen, Cpu, Sparkles, Compass, Layers, Star, Shuffle, ArrowRightLeft, ExternalLink, Play } from 'lucide-react';
import { CATEGORIES } from '../data/learningItems';
import type { CategoryType } from '../data/learningItems';

interface CategorySelectProps {
  onStartCategory: (category: CategoryType, isShuffle: boolean, direction: 'en-ja' | 'ja-en', bookmarkOnly: boolean) => void;
  bookmarkCount: number;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ onStartCategory, bookmarkCount }) => {
  const [isShuffle, setIsShuffle] = useState(true);
  const [direction, setDirection] = useState<'en-ja' | 'ja-en'>('en-ja');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      {/* ヒーロー紹介バナー */}
      <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--card-shadow)] text-left relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-bold">
            <span>Anthropic公式ブログ完全準拠</span>
          </div>
          <h2 className="text-xl font-black text-[var(--text-main)] tracking-tight">
            How we contain Claude
          </h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            現代の最先端AIエンジニアリングで頻出する、格調高い論説英語・重要語彙・構文をマスターしましょう。
          </p>
          <a
            href="https://www.anthropic.com/engineering/how-we-contain-claude"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-[var(--primary)] font-medium hover:underline pt-1"
          >
            <span>元記事を読む</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 学習設定（シャッフル & 出題方向） */}
      <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between text-xs">
        {/* 出題順シャッフル */}
        <button
          onClick={() => setIsShuffle(!isShuffle)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
            isShuffle
              ? 'bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary)]/30'
              : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
          }`}
        >
          <Shuffle className="w-4 h-4" />
          <span>シャッフル: {isShuffle ? 'ON' : 'OFF'}</span>
        </button>

        {/* 出題方向（英→日 / 日→英） */}
        <button
          onClick={() => setDirection(direction === 'en-ja' ? 'ja-en' : 'en-ja')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-semibold transition cursor-pointer"
        >
          <ArrowRightLeft className="w-4 h-4 text-[var(--primary)]" />
          <span>{direction === 'en-ja' ? '英 → 日 (読解)' : '日 → 英 (想起)'}</span>
        </button>
      </div>

      {/* 苦手・ブックマーク問題カード（1問以上ある場合） */}
      {bookmarkCount > 0 && (
        <button
          onClick={() => onStartCategory('all', isShuffle, direction, true)}
          className="w-full p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 hover:bg-amber-500/20 text-left transition flex items-center justify-between cursor-pointer group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-sm">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                苦手・ブックマーク単語
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold">
                  {bookmarkCount} 問
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">
                星を付けた単語を集中トレーニング
              </div>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 group-hover:translate-x-1 transition">
            <Play className="w-4 h-4 fill-amber-600" />
          </div>
        </button>
      )}

      {/* カテゴリ一覧 */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-[var(--text-muted)] px-1">
          カテゴリーを選択してスタート
        </div>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onStartCategory(cat.id, isShuffle, direction, false)}
            className="w-full p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--card-shadow)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/40 transition flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--bg-muted)] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition">
                {getIcon(cat.icon)}
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--text-main)]">
                  {cat.label}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {cat.count} 問 収録
                </div>
              </div>
            </div>

            <div className="p-2 rounded-xl text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition">
              <Play className="w-4 h-4 fill-current" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
