
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Habit, WEEKDAY_NAMES_FA } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onUpdate: (habits: Habit[]) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onUpdate }) => {
  const addHabit = () => {
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      checks: Array(7).fill(false)
    };
    onUpdate([...habits, newHabit]);
  };

  const updateHabit = (id: string, name: string) => {
    onUpdate(habits.map(h => h.id === id ? { ...h, name } : h));
  };

  const toggleCheck = (habitId: string, dayIdx: number) => {
    onUpdate(habits.map(h => {
      if (h.id === habitId) {
        const newChecks = [...h.checks];
        newChecks[dayIdx] = !newChecks[dayIdx];
        return { ...h, checks: newChecks };
      }
      return h;
    }));
  };

  const removeHabit = (id: string) => {
    onUpdate(habits.filter(h => h.id !== id));
  };

  const totalChecks = habits.reduce((acc, h) => acc + h.checks.filter(c => c).length, 0);
  const totalPossible = habits.length * 7;
  const progress = totalPossible > 0 ? Math.round((totalChecks / totalPossible) * 100) : 0;

  return (
    <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-800">عادات هفتگی</h3>
        <button 
          onClick={addHabit}
          className="flex items-center gap-1 text-sm bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
        >
          <Plus size={16} />
          عادت جدید
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="text-right pb-4 text-xs font-bold text-slate-400 uppercase">نام عادت</th>
              {WEEKDAY_NAMES_FA.map((day, i) => (
                <th key={i} className="pb-4 text-[10px] font-bold text-slate-400">{day[0]}</th>
              ))}
              <th className="pb-4"></th>
            </tr>
          </thead>
          <tbody className="space-y-2">
            {habits.map((habit) => (
              <tr key={habit.id} className="group">
                <td className="text-right py-2">
                  <input
                    type="text"
                    value={habit.name}
                    onChange={(e) => updateHabit(habit.id, e.target.value)}
                    placeholder="نام عادت..."
                    className="w-full bg-transparent border-none text-sm outline-none text-slate-700"
                  />
                </td>
                {habit.checks.map((checked, i) => (
                  <td key={i} className="py-2 px-1">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCheck(habit.id, i)}
                      className="w-5 h-5 rounded-md border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                  </td>
                ))}
                <td className="py-2">
                  <button 
                    onClick={() => removeHabit(habit.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
          <span>پیشرفت کلی</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
