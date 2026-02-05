
import React from 'react';
import { Trash2, Plus, CheckCircle2, Circle } from 'lucide-react';
import { DayData, WEEKDAY_NAMES_FA, Task } from '../types';

interface DayCardProps {
  dayIndex: number;
  data: DayData;
  date: Date;
  onUpdate: (updated: DayData) => void;
}

const DayCard: React.FC<DayCardProps> = ({ dayIndex, data, date, onUpdate }) => {
  const updatePriorities = (idx: number, val: string) => {
    const newPriorities = [...data.priorities];
    newPriorities[idx] = val;
    onUpdate({ ...data, priorities: newPriorities });
  };

  const addTask = () => {
    const newTask: Task = { id: Math.random().toString(36).substr(2, 9), text: '', completed: false };
    onUpdate({ ...data, tasks: [...data.tasks, newTask] });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const newTasks = data.tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    onUpdate({ ...data, tasks: newTasks });
  };

  const removeTask = (id: string) => {
    onUpdate({ ...data, tasks: data.tasks.filter(t => t.id !== id) });
  };

  const colors = [
    'bg-rose-50 border-rose-200',
    'bg-amber-50 border-amber-200',
    'bg-emerald-50 border-emerald-200',
    'bg-sky-50 border-sky-200',
    'bg-indigo-50 border-indigo-200',
    'bg-violet-50 border-violet-200',
    'bg-slate-50 border-slate-200'
  ];

  return (
    <div className={`flex flex-col h-full min-h-[500px] border-2 rounded-2xl p-4 transition-all hover:shadow-lg ${colors[dayIndex % colors.length]}`}>
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg text-slate-800">{WEEKDAY_NAMES_FA[dayIndex]}</h3>
        <p className="text-xs text-slate-500">{new Intl.DateTimeFormat('fa-IR').format(date)}</p>
      </div>

      <div className="space-y-4 flex-grow">
        {/* Priorities */}
        <section>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">اولویت‌های اصلی</h4>
          <div className="space-y-2">
            {[0, 1, 2].map(i => (
              <input
                key={i}
                type="text"
                placeholder={`${i + 1}. مهم‌ترین کار...`}
                value={data.priorities[i] || ''}
                onChange={(e) => updatePriorities(i, e.target.value)}
                className="w-full bg-white/50 border border-transparent focus:border-slate-300 focus:bg-white rounded-lg px-3 py-1.5 text-sm outline-none transition-all"
              />
            ))}
          </div>
        </section>

        {/* Tasks */}
        <section className="flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">لیست کارها</h4>
            <button onClick={addTask} className="p-1 hover:bg-white rounded-full transition-colors">
              <Plus size={14} className="text-slate-600" />
            </button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {data.tasks.map((task) => (
              <div key={task.id} className="group flex items-start gap-2 animate-in fade-in slide-in-from-right-2">
                <button 
                  onClick={() => updateTask(task.id, { completed: !task.completed })}
                  className="mt-1 transition-transform active:scale-90"
                >
                  {task.completed ? 
                    <CheckCircle2 size={18} className="text-emerald-500" /> : 
                    <Circle size={18} className="text-slate-300 hover:text-slate-400" />
                  }
                </button>
                <textarea
                  value={task.text}
                  onChange={(e) => updateTask(task.id, { text: e.target.value })}
                  placeholder="کار جدید..."
                  rows={1}
                  className={`flex-grow bg-transparent border-none resize-none text-sm outline-none ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}
                />
                <button 
                  onClick={() => removeTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DayCard;
