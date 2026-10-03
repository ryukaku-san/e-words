import { Moon, Sun, Palette, Calendar, Layers, BookOpen } from 'lucide-react';
import type { UITheme } from '../utils/storage';

interface HeaderProps {
  currentTab: 'home' | 'calendar' | 'list';
  onSelectTab: (tab: 'home' | 'calendar' | 'list') => void;
  theme: UITheme;
  onChangeTheme: (theme: UITheme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  theme,
  onChangeTheme,
}) => {
  return (
    <header className="w-full max-w-md mx-auto py-4 px-2 space-y-3">
      {/* 上段：ロゴ ＆ テーマスイッチャー（シンプル / ダーク / ポップ） */}
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

        {/* 3種のUIテーマ切り替えボタン（シンプル / ダーク / ポップ） */}
        <div className="flex items-center p-1 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-color)]">
          <button
            onClick={() => onChangeTheme('simple')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              theme === 'simple'
                ? 'bg-[var(--bg-card)] text-[var(--primary)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
            title="シンプルUI（清潔感・ミニマル）"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">シンプル</span>
          </button>

          <button
            onClick={() => onChangeTheme('dark')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              theme === 'dark'
                ? 'bg-[var(--bg-card)] text-[var(--primary)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
            title="ダークUI（漆黒・サイバーネオン）"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ダーク</span>
          </button>

          <button
            onClick={() => onChangeTheme('pop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              theme === 'pop'
                ? 'bg-[var(--bg-card)] text-[var(--primary)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
            title="ポップUI（親しみやすい・カラフル）"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ポップ</span>
          </button>
        </div>
      </div>

      {/* 下段：メインナビゲーションタブ */}
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
