import React, { useState } from 'react';
import { BookOpen, Cpu, Sparkles, Compass, Layers, Star, Shuffle, ArrowRightLeft, ExternalLink, Play } from 'lucide-react';
import { CATEGORIES } from '../data/learningItems';
import type { CategoryType } from '../data/learningItems';

interface CategorySelectProps {
  onStartCategory: (category: CategoryType, isShuffle: boolean, direction: 'en-ja' | 'ja-en', bookmarkOnly: boolean) => void;
  bookmarkCount: number;
}

interface CategoryOption {
  isShuffle: boolean;
  direction: 'en-ja' | 'ja-en';
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ onStartCategory, bookmarkCount }) => {
  // 各カテゴリーごとの設定（デフォルト: シャッフルON, 英→日）
  const [options, setOptions] = useState<Record<string, CategoryOption>>({
    general_word: { isShuffle: true, direction: 'en-ja' },
    tech_word: { isShuffle: true, direction: 'en-ja' },
    idiom: { isShuffle: true, direction: 'en-ja' },
    grammar: { isShuffle: true, direction: 'en-ja' },
    all: { isShuffle: true, direction: 'en-ja' },
    bookmarks: { isShuffle: true, direction: 'en-ja' },
  });

  const getOption = (key: string): CategoryOption => {
    return options[key] || { isShuffle: true, direction: 'en-ja' };
  };

  const toggleShuffle = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOptions((prev) => {
      const cur = prev[key] || { isShuffle: true, direction: 'en-ja' };
      return {
        ...prev,
        [key]: { ...cur, isShuffle: !cur.isShuffle },
      };
    });
  };

  const toggleDirection = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOptions((prev) => {
      const cur = prev[key] || { isShuffle: true, direction: 'en-ja' };
      return {
        ...prev,
        [key]: { ...cur, direction: cur.direction === 'en-ja' ? 'ja-en' : 'en-ja' },
      };
    });
  };

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
    <div className="w-full max-w-md mx-auto space-y-3.5">
      {/* 1. カテゴリー一覧（単語 → 技術用語 → 熟語 → 英文法・構文 → すべて） */}
      <div className="space-y-2">
        {CATEGORIES.map((cat) => {
          const opt = getOption(cat.id);

          return (
            <div
              key={cat.id}
              onClick={() => onStartCategory(cat.id, opt.isShuffle, opt.direction, false)}
              className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--card-shadow)] hover:border-[var(--primary)] transition flex items-center justify-between cursor-pointer group"
            >
              {/* 左側：アイコン ＆ タイトル ＆ 件数 */}
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="p-2 rounded-lg bg-[var(--bg-muted)] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition shrink-0">
                  {getIcon(cat.icon)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[var(--text-main)] truncate">
                    {cat.label}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {cat.count} 問
                  </div>
                </div>
              </div>

              {/* 右側：シャッフル ＆ 日英切替 ＆ 再生ボタン */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* シャッフル切替ボタン */}
                <button
                  type="button"
                  onClick={(e) => toggleShuffle(cat.id, e)}
                  className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                    opt.isShuffle
                      ? 'bg-blue-50 text-[var(--primary)] border border-blue-200'
                      : 'bg-[var(--bg-muted)] text-[var(--text-muted)] border border-transparent'
                  }`}
                  title={opt.isShuffle ? 'シャッフル: ON' : 'シャッフル: OFF'}
                  aria-label="シャッフル切替"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>

                {/* 言語方向切替ボタン */}
                <button
                  type="button"
                  onClick={(e) => toggleDirection(cat.id, e)}
                  className="px-2 py-1 rounded-lg bg-[var(--bg-muted)] hover:bg-slate-200 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition cursor-pointer flex items-center gap-1 border border-slate-200/60"
                  title="出題方向切替"
                >
                  <ArrowRightLeft className="w-3 h-3 text-[var(--primary)]" />
                  <span>{opt.direction === 'en-ja' ? '英→日' : '日→英'}</span>
                </button>

                {/* 学習開始（再生）ボタン */}
                <button
                  type="button"
                  onClick={() => onStartCategory(cat.id, opt.isShuffle, opt.direction, false)}
                  className="p-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm transition cursor-pointer flex items-center justify-center group-hover:scale-105"
                  title="学習を始める"
                  aria-label="スタート"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          );
        })}

        {/* 苦手・ブックマーク問題カード（1問以上ある場合） */}
        {bookmarkCount > 0 && (() => {
          const opt = getOption('bookmarks');
          return (
            <div
              onClick={() => onStartCategory('all', opt.isShuffle, opt.direction, true)}
              className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 hover:border-amber-400 transition flex items-center justify-between cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0">
                  <Star className="w-5 h-5 fill-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-amber-950 truncate">
                    苦手・ブックマーク
                  </div>
                  <div className="text-[11px] text-amber-800">
                    {bookmarkCount} 問
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => toggleShuffle('bookmarks', e)}
                  className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    opt.isShuffle
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-white/80 text-amber-700'
                  }`}
                  title={opt.isShuffle ? 'シャッフル: ON' : 'シャッフル: OFF'}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => toggleDirection('bookmarks', e)}
                  className="px-2 py-1 rounded-lg bg-white/80 hover:bg-white text-[11px] font-semibold text-amber-900 transition cursor-pointer flex items-center gap-1 border border-amber-200"
                >
                  <ArrowRightLeft className="w-3 h-3 text-amber-700" />
                  <span>{opt.direction === 'en-ja' ? '英→日' : '日→英'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onStartCategory('all', opt.isShuffle, opt.direction, true)}
                  className="p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition cursor-pointer flex items-center justify-center group-hover:scale-105"
                  title="学習を始める"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 2. 参考としたブログ記事（画面下部に配置） */}
      <div className="mt-6 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-left shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-[var(--text-muted)] text-[11px] font-semibold mb-1.5">
          教材出典
        </div>
        <h3 className="text-sm font-bold text-[var(--text-main)]">
          Anthropic Engineering Blog: How we contain Claude
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
          本アプリの語彙・構文は、Anthropic公式ブログの解説記事をもとに抽出・作成されています。
        </p>
        <a
          href="https://www.anthropic.com/engineering/how-we-contain-claude"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[var(--primary)] font-medium hover:underline mt-2"
        >
          <span>元記事を読む</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
