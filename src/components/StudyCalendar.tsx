import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Flame, Award, Calendar as CalendarIcon } from 'lucide-react';
import type { UserProgress, DayStudyRecord } from '../utils/storage';

interface StudyCalendarProps {
  progress: UserProgress;
  onSelectDate?: (dateStr: string) => void;
}

export const StudyCalendar: React.FC<StudyCalendarProps> = ({ progress }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayRecord, setSelectedDayRecord] = useState<DayStudyRecord | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 前月・次月移動
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayRecord(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayRecord(null);
  };

  // カレンダー日付計算
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateStr(dateStr);
    const rec = progress.history[dateStr] || null;
    setSelectedDayRecord(rec);
  };

  const todayStr = (() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  })();

  // 累計学習日数
  const totalDaysStudied = Object.keys(progress.history).length;
  // 累計回答問題数
  const totalQuestions = Object.values(progress.history).reduce((acc, cur) => acc + cur.totalAnswered, 0);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* 統計バッジ */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-lg">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            <span>{progress.streakDays}</span>
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">連続学習日数</div>
        </div>

        <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-500 font-bold text-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>{totalDaysStudied}</span>
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">累計学習日数</div>
        </div>

        <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-blue-500 font-bold text-lg">
            <Award className="w-5 h-5 text-blue-500" />
            <span>{totalQuestions}</span>
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">総回答数</div>
        </div>
      </div>

      {/* カレンダー本体 */}
      <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[var(--card-shadow)]">
        {/* 月ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[var(--primary)]" />
            {year}年 {month + 1}月
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-muted)] transition"
              aria-label="前月"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-muted)] transition"
              aria-label="次月"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 曜日行 */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-[var(--text-muted)] mb-2">
          <span className="text-red-400">日</span>
          <span>月</span>
          <span>火</span>
          <span>水</span>
          <span>木</span>
          <span>金</span>
          <span className="text-blue-400">土</span>
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-10" />;
            }

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = progress.history[dateStr];
            const hasStudied = !!record && record.totalAnswered > 0;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDateStr;

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(day)}
                className={`relative h-10 w-full flex flex-col items-center justify-center rounded-xl text-sm font-medium transition cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[var(--primary)] bg-[var(--primary-light)]'
                    : 'hover:bg-[var(--bg-muted)]'
                } ${isToday ? 'font-bold underline decoration-2 decoration-[var(--primary)]' : ''}`}
              >
                <span className={`z-10 ${hasStudied ? 'text-emerald-700 dark:text-emerald-400' : 'text-[var(--text-main)]'}`}>
                  {day}
                </span>

                {/* 学習済みの日の「丸（スタンプ）」 */}
                {hasStudied && (
                  <span className="absolute inset-1 rounded-full border-2 border-emerald-500 bg-emerald-500/10 pointer-events-none animate-in fade-in zoom-in-75 duration-200">
                    <span className="sr-only">学習済み</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ガイド */}
        <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 bg-emerald-500/20 inline-block" />
            <span>学習した日（丸）</span>
          </div>
          <span>日付タップで詳細</span>
        </div>
      </div>

      {/* 選択した日の学習詳細ポップアップ / カード */}
      {selectedDateStr && (
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-sm text-[var(--text-main)]">
              📅 {selectedDateStr} の記録
            </div>
            {selectedDayRecord ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold">
                達成！
              </span>
            ) : (
              <span className="text-xs text-[var(--text-muted)]">記録なし</span>
            )}
          </div>

          {selectedDayRecord ? (
            <div className="space-y-2 text-xs text-[var(--text-muted)]">
              <div className="flex justify-between">
                <span>解いた問題数:</span>
                <span className="font-bold text-[var(--text-main)]">{selectedDayRecord.totalAnswered} 問</span>
              </div>
              <div className="flex justify-between">
                <span>正解 / 不正解:</span>
                <span>
                  <span className="text-emerald-500 font-bold">{selectedDayRecord.correctCount} 正解</span> /{' '}
                  <span className="text-red-500 font-bold">{selectedDayRecord.incorrectCount} 不正解</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>正答率:</span>
                <span className="font-bold text-[var(--text-main)]">
                  {selectedDayRecord.totalAnswered > 0
                    ? `${Math.round((selectedDayRecord.correctCount / selectedDayRecord.totalAnswered) * 100)}%`
                    : '0%'}
                </span>
              </div>
              {selectedDayRecord.categories && selectedDayRecord.categories.length > 0 && (
                <div className="pt-1 flex flex-wrap gap-1">
                  {selectedDayRecord.categories.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[var(--bg-muted)] rounded text-[10px] text-[var(--text-muted)]">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)]">
              この日の学習記録はありません。カード学習を完了すると自動で丸がつきます！
            </p>
          )}
        </div>
      )}
    </div>
  );
};
