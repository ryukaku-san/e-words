import React from 'react';
import { Target, Newspaper, ChevronRight } from 'lucide-react';
import { TARGET1900_ITEMS } from '../data/target1900';
import { LEARNING_ITEMS } from '../data/learningItems';

interface TopPageProps {
  onSelectDeck: (deck: 'article' | 'target1900') => void;
}

export const TopPage: React.FC<TopPageProps> = ({ onSelectDeck }) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-4 pt-6">
      {/* ロゴ */}
      <div className="text-center space-y-2 pb-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--primary)] flex items-center justify-center text-white shadow-md font-black text-2xl">
          E
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--text-main)]">E-Words</h1>
        <p className="text-xs text-[var(--text-muted)] font-medium">
          学びたい教材を選んでください
        </p>
      </div>

      {/* ターゲット1900 */}
      <button
        type="button"
        onClick={() => onSelectDeck('target1900')}
        className="w-full p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--card-shadow)] hover:border-[var(--primary)] transition flex items-center justify-between cursor-pointer group text-left"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[var(--primary)] text-white shadow-sm shrink-0">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <div className="font-extrabold text-lg text-[var(--text-main)]">
              ターゲット1900
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              英単語ターゲット1900（6訂版）の見出し語 {TARGET1900_ITEMS.length.toLocaleString()} 語を、100語ずつ区切って学習できます
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition shrink-0" />
      </button>

      {/* 英語記事タイトル（従来の教材） */}
      <button
        type="button"
        onClick={() => onSelectDeck('article')}
        className="w-full p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--card-shadow)] hover:border-[var(--primary)] transition flex items-center justify-between cursor-pointer group text-left"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[var(--bg-muted)] text-[var(--primary)] shadow-sm shrink-0">
            <Newspaper className="w-7 h-7" />
          </div>
          <div>
            <div className="font-extrabold text-lg text-[var(--text-main)]">
              英語記事タイトル
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              Anthropic の技術記事から抽出した語彙・熟語・文法 {LEARNING_ITEMS.length} 項目
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition shrink-0" />
      </button>
    </div>
  );
};
