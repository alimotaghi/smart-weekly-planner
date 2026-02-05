
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Download, 
  Trash2, 
  Sparkles,
  Quote
} from 'lucide-react';
import { WeekData, DayData, Habit, Task } from './types';
import { getStartOfWeek, formatDateFA, getWeekRangeKey } from './utils/dateUtils';
import DayCard from './components/DayCard';
import HabitTracker from './components/HabitTracker';
import { getMotivationalQuote } from './services/geminiService';

const DEFAULT_WEEK_DATA: WeekData = {
  quote: "در زمان سخت به یاد بیاور، چالش‌ها راهی دیگر و سازگارتر را نشان می‌دهند",
  reminders: [],
  habits: [
    { id: '1', name: '📚 مطالعه روزانه', checks: Array(7).fill(false) },
    { id: '2', name: '💧 نوشیدن آب', checks: Array(7).fill(false) },
    { id: '3', name: '🧘 مدیتیشن', checks: Array(7).fill(false) }
  ],
  days: {}
};

const createInitialDay = (): DayData => ({
  priorities: ['', '', ''],
  events: [],
  tasks: []
});

const App: React.FC = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [data, setData] = useState<WeekData>(DEFAULT_WEEK_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const weekKey = getWeekRangeKey(weekOffset);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(weekKey);
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      setData(DEFAULT_WEEK_DATA);
    }
  }, [weekKey]);

  // Save data
  const handleSave = useCallback(() => {
    setIsSaving(true);
    localStorage.setItem(weekKey, JSON.stringify(data));
    setTimeout(() => setIsSaving(false), 1000);
  }, [data, weekKey]);

  const updateDay = (dayIndex: number, dayData: DayData) => {
    setData(prev => ({
      ...prev,
      days: { ...prev.days, [dayIndex]: dayData }
    }));
  };

  const updateHabits = (habits: Habit[]) => {
    setData(prev => ({ ...prev, habits }));
  };

  const updateReminders = (reminders: Task[]) => {
    setData(prev => ({ ...prev, reminders }));
  };

  const addReminder = () => {
    const newReminder: Task = { id: Math.random().toString(36).substr(2, 9), text: '', completed: false };
    updateReminders([...data.reminders, newReminder]);
  };

  const toggleReminder = (id: string) => {
    updateReminders(data.reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const updateReminderText = (id: string, text: string) => {
    updateReminders(data.reminders.map(r => r.id === id ? { ...r, text } : r));
  };

  const removeReminder = (id: string) => {
    updateReminders(data.reminders.filter(r => r.id !== id));
  };

  const handleAiQuote = async () => {
    setIsAiLoading(true);
    // Gather some tasks for context - explicitly cast Object.values to DayData[] to fix "unknown" type error on line 96
    const allTasks = (Object.values(data.days) as DayData[]).flatMap(d => d.tasks.map(t => t.text)).filter(Boolean);
    const newQuote = await getMotivationalQuote(allTasks.slice(0, 10));
    setData(prev => ({ ...prev, quote: newQuote }));
    setIsAiLoading(false);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planner_${weekKey}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('آیا از پاک کردن تمام داده‌های این هفته اطمینان دارید؟')) {
      setData(DEFAULT_WEEK_DATA);
      localStorage.removeItem(weekKey);
    }
  };

  const startOfWeek = getStartOfWeek(weekOffset);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header Controls */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="bg-indigo-100 p-3 rounded-2xl">
            <CalendarIcon className="text-indigo-600" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">پلنر هوشمند هفتگی</h1>
            <p className="text-slate-500 text-sm">{formatDateFA(startOfWeek)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setWeekOffset(prev => prev - 1)}
            className="p-2 hover:bg-white rounded-xl transition-all hover:shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
          <span className="px-4 py-1 text-sm font-bold text-slate-700 min-w-[120px] text-center">
            {weekOffset === 0 ? 'این هفته' : weekOffset > 0 ? `${weekOffset} هفته بعد` : `${Math.abs(weekOffset)} هفته قبل`}
          </span>
          <button 
            onClick={() => setWeekOffset(prev => prev + 1)}
            className="p-2 hover:bg-white rounded-xl transition-all hover:shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${isSaving ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-white hover:bg-slate-900'}`}
          >
            <Save size={18} />
            {isSaving ? 'ذخیره شد' : 'ذخیره'}
          </button>
          <button 
            onClick={handleExport}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"
            title="خروجی JSON"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={handleReset}
            className="p-2.5 bg-white border border-rose-100 text-rose-500 rounded-2xl hover:bg-rose-50 transition-all"
            title="پاک کردن"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar Info */}
        <div className="lg:col-span-3 space-y-8">
          {/* AI Quote Section */}
          <div className="bg-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden group shadow-xl shadow-indigo-200">
            <Sparkles className="absolute -top-4 -left-4 text-indigo-400 opacity-20 w-24 h-24 rotate-12" />
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <Quote size={24} className="text-indigo-300" />
                <button 
                  onClick={handleAiQuote}
                  disabled={isAiLoading}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors disabled:opacity-50"
                  title="جمله انگیزشی جدید"
                >
                  <Sparkles size={18} className={isAiLoading ? 'animate-spin' : ''} />
                </button>
              </div>
              <textarea
                value={data.quote}
                onChange={(e) => setData(prev => ({ ...prev, quote: e.target.value }))}
                className="w-full bg-transparent border-none resize-none text-lg font-medium leading-relaxed outline-none min-h-[100px]"
                placeholder="شعار این هفته شما..."
              />
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-100 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-amber-900">یادآوری‌ها</h3>
              <button onClick={addReminder} className="bg-amber-100 p-1 rounded-lg hover:bg-amber-200 transition-colors">
                <Sparkles size={16} className="text-amber-700" />
              </button>
            </div>
            <div className="space-y-3">
              {data.reminders.map(rem => (
                <div key={rem.id} className="flex items-center gap-2 group">
                  <input 
                    type="checkbox" 
                    checked={rem.completed}
                    onChange={() => toggleReminder(rem.id)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <input 
                    type="text" 
                    value={rem.text}
                    onChange={(e) => updateReminderText(rem.id, e.target.value)}
                    placeholder="یادآوری..."
                    className={`flex-grow bg-transparent border-none text-sm outline-none ${rem.completed ? 'line-through text-amber-400' : 'text-amber-800'}`}
                  />
                  <button onClick={() => removeReminder(rem.id)} className="opacity-0 group-hover:opacity-100 text-amber-400 hover:text-amber-600">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {data.reminders.length === 0 && (
                <p className="text-xs text-amber-400 italic">لیست خالی است...</p>
              )}
            </div>
          </div>

          {/* Habit Tracker */}
          <HabitTracker habits={data.habits} onUpdate={updateHabits} />
        </div>

        {/* Main Days Grid */}
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {weekDays.map((date, idx) => (
              <DayCard 
                key={idx}
                dayIndex={idx}
                date={date}
                data={data.days[idx] || createInitialDay()}
                onUpdate={(updated) => updateDay(idx, updated)}
              />
            ))}
          </div>
        </div>
      </div>

      <footer className="text-center py-8 text-slate-400 text-xs">
        طراحی شده با ❤️ برای برنامه‌ریزی بهتر زندگی • {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
