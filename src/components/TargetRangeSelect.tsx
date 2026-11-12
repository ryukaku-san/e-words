import React, { useState } from 'react';
import { Star, Shuffle, ArrowRightLeft, Play } from 'lucide-react';
import { TARGET1900_ITEMS } from '../data/target1900';

export const TARGET_RANGE_SIZE = 100;

export interface TargetRange {
  startNo: number; // 1始まり
  endNo: number;
}

export const TARGET_RANGES: TargetRange[] = (() => {
  const ranges: TargetRange[] = [];
  for (let start = 1; start <= TARGET1900_ITEMS.length; start += TARGET_RANGE_SIZE) {
    ranges.push({
      startNo: start,
      endNo: Math.min(start + TARGET_RANGE_SIZE - 1, TARGET1900_ITEMS.length),
    });
  }
  return ranges;
})();

interface TargetRangeSelectProps {
  onStartRange: (
    range: TargetRange | null, // null = ブックマークのみ
    isShuffle: boolean,
    direction: 'en-ja' | 'ja-en',
    bookmarkOnly: boolean
  ) => void;
  bookmarkCount: number; // ターゲット1900内のブックマーク数
}

interface RangeOption {
  isShuffle: boolean;
  direction: 'en-ja' | 'ja-en';
}

export const TargetRangeSelect: React.FC<TargetRangeSelectProps> = ({
  onStartRange,
  bookmarkCount,
}) => {
  const [options, setOptions] = useState<Record<string, RangeOption>>({});

  const getOption = (key: string): RangeOption => {
    return options[key] || { isShuffle: false, direction: 'en-ja' };
  };

  const toggleShuffle = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOptions((prev) => {
      const cur = prev[key] || { isShuffle: false, direction: 'en-ja' };
      return { ...prev, [key]: { ...cur, isShuffle: !cur.isShuffle } };
    });
  };

  const toggleDirection = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOptions((prev) => {
      const cur = prev[key] || { isShuffle: false, direction: 'en-ja' };
      return {
        ...prev,
        [key]: { ...cur, direction: cur.direction === 'en-ja' ? 'ja-en' : 'en-ja' },
      };
    });
  };

  const renderOptionButtons = (key: string, amber = false) => {
    const opt = getOption(key);
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={(e) => toggleShuffle(key, e)}
          className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
            opt.isShuffle
              ? amber
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-blue-50 text-[var(--primary)] border border-blue-200'
              : amber
                ? 'bg-white/80 text-amber-700'
                : 'bg-[var(--bg-muted)] text-[var(--text-muted)] border border-transparent'
          }`}
          title={opt.isShuffle ? 'シャッフル: ON' : 'シャッフル: OFF'}
          aria-label="シャッフル切替"
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => toggleDirection(key, e)}
          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 border ${
            amber
              ? 'bg-white/80 hover:bg-white text-amber-900 border-amber-200'
              : 'bg-[var(--bg-muted)] hover:bg-slate-200 text-[var(--text-muted)] hover:text-[var(--text-main)] border-slate-200/60'
          }`}
          title="出題方向切替"
        >
          <ArrowRightLeft className={`w-3 h-3 ${amber ? 'text-amber-700' : 'text-[var(--primary)]'}`} />
          <span>{opt.direction === 'en-ja' ? '英→日' : '日→英'}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3.5">
      <p className="text-xs text-[var(--text-muted)] px-1">
        学習する範囲（No.）を選んでください。各範囲は10語ずつのチャンクで出題されます。
      </p>

      <div className="space-y-2">
        {TARGET_RANGES.map((range) => {
          const key = `range-${range.startNo}`;
          const opt = getOption(key);
          return (
            <div
              key={key}
              onClick={() => onStartRange(range, opt.isShuffle, opt.direction, false)}
              className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--card-shadow)] hover:border-[var(--primary)] transition flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="px-2.5 py-2 rounded-lg bg-[var(--bg-muted)] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition shrink-0 font-extrabold text-xs font-mono">
                  {range.startNo}–{range.endNo}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[var(--text-main)] truncate">
                    No.{range.startNo}〜{range.endNo}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {range.endNo - range.startNo + 1} 問
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {renderOptionButtons(key)}
                <button
                  type="button"
                  onClick={() => onStartRange(range, opt.isShuffle, opt.direction, false)}
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

        {/* 苦手・ブックマーク（ターゲット1900内） */}
        {bookmarkCount > 0 &&
          (() => {
            const key = 'bookmarks';
            const opt = getOption(key);
            return (
              <div
                onClick={() => onStartRange(null, opt.isShuffle, opt.direction, true)}
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
                    <div className="text-[11px] text-amber-800">{bookmarkCount} 問</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {renderOptionButtons(key, true)}
                  <button
                    type="button"
                    onClick={() => onStartRange(null, opt.isShuffle, opt.direction, true)}
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

      {/* 出典 */}
      <div className="mt-6 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-left shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-[var(--text-muted)] text-[11px] font-semibold mb-1.5">
          教材出典
        </div>
        <h3 className="text-sm font-bold text-[var(--text-main)]">
          英単語ターゲット1900（6訂版）
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
          見出し語と意味は、公開されている単語一覧をもとに収録しています。品詞は目安として自動付与したものです。
        </p>
      </div>
    </div>
  );
};
