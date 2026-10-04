import React, { useState, useMemo } from 'react';
import { Search, Volume2, Star } from 'lucide-react';
import { LEARNING_ITEMS, CATEGORIES } from '../data/learningItems';
import type { CategoryType } from '../data/learningItems';
import { speakEnglish } from '../utils/speech';

interface WordListProps {
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
}

export const WordList: React.FC<WordListProps> = ({ bookmarks, onToggleBookmark }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return LEARNING_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.term.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.etymology.toLowerCase().includes(q) ||
        (item.usage && item.usage.toLowerCase().includes(q)) ||
        (item.explanation && item.explanation.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* 検索バー */}
      <div className="relative">
        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="英語・意味・語源で検索..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition"
        />
      </div>

      {/* カテゴリフィルタタブ */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)] hover:text-[var(--text-main)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 件数表示 */}
      <div className="text-xs text-[var(--text-muted)] px-1">
        {filteredItems.length} 件 表示中
      </div>

      {/* 単語リスト */}
      <div className="space-y-2">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const isBookmarked = bookmarks.includes(item.id);

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm hover:border-[var(--primary)]/50 transition"
            >
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[var(--text-main)]">
                      {item.term}
                    </span>
                    {item.pos && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-muted)] font-mono">
                        {item.pos}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    {item.meaning}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakEnglish(item.term);
                    }}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--bg-muted)] transition cursor-pointer"
                    title="発音を聞く"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(item.id);
                    }}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition cursor-pointer"
                    title="ブックマーク"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        isBookmarked ? 'fill-amber-400 text-amber-400' : 'hover:text-amber-400'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 展開時の詳細（語源・文法解説） */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[var(--border-color)] space-y-2 text-xs animate-in fade-in duration-150">
                  {item.structure && (
                    <div className="p-2 rounded-lg bg-[var(--bg-muted)] font-mono text-[var(--primary)] font-semibold text-[11px]">
                      構造: {item.structure}
                    </div>
                  )}

                  {/* 語源 */}
                  {item.etymology && (
                    <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-slate-700 leading-relaxed">
                      <span className="font-bold text-blue-900 block mb-0.5">🌱 語源・成り立ち</span>
                      {item.etymology}
                    </div>
                  )}

                  {(item.usage || item.explanation) && (
                    <div className="text-[var(--text-muted)] leading-relaxed">
                      <span className="font-semibold text-[var(--text-main)]">
                        {item.category === 'grammar' ? '💡 解説: ' : '📖 文脈: '}
                      </span>
                      {item.explanation || item.usage}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
