import React from 'react';
import { Calendar, Layers, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'calendar' | 'list';
  onSelectTab: (tab: 'home' | 'calendar' | 'list') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab }) => {
  return (
    <header className="w-full max-w-md mx-auto py-3 px-3 space-y-3">
      {/* ロゴ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white shadow-sm font-black text-sm">
            E
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[var(--text-main)] leading-none">
              E-Words
            </h1>
            <span className="text-[10px] text-[var(--text-muted)] font-medium">
              Tech & Essay English
            </span>
          </div>
        </div>
      </div>

      {/* ナビゲーションタブ */}
      <nav className="flex items-center p-1 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            currentTab === 'home'
              ? 'bg-[var(--primary)] text-white shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>学習</span>
        </button>

        <button
          onClick={() => onSelectTab('calendar')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            currentTab === 'calendar'
              ? 'bg-[var(--primary)] text-white shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>カレンダー</span>
        </button>

        <button
          onClick={() => onSelectTab('list')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            currentTab === 'list'
              ? 'bg-[var(--primary)] text-white shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>単語一覧</span>
        </button>
      </nav>
    </header>
  );
};
