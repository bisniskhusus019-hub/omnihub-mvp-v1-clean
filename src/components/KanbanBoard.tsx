import { useState } from 'react';
import { Plus, Flag, CheckCircle2, Clock, Circle } from 'lucide-react';
import { mockKanbanTasks } from '../data/mockData';

type Priority = 'high' | 'medium' | 'low';
type Task = { id: string; title: string; priority: Priority; assignee: string };
type ColumnKey = 'todo' | 'inProgress' | 'done';

const priorityConfig: Record<Priority, { label: string; color: string; dot: string }> = {
  high: { label: 'High', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', dot: 'bg-rose-400' },
  medium: { label: 'Medium', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  low: { label: 'Low', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
};

const columns: { key: ColumnKey; label: string; icon: React.ComponentType<{ size: number; className?: string }>; color: string }[] = [
  { key: 'todo', label: 'To Do', icon: Circle, color: 'text-slate-400' },
  { key: 'inProgress', label: 'In Progress', icon: Clock, color: 'text-amber-400' },
  { key: 'done', label: 'Done', icon: CheckCircle2, color: 'text-emerald-400' },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Record<ColumnKey, Task[]>>(mockKanbanTasks as Record<ColumnKey, Task[]>);
  const [newTaskInput, setNewTaskInput] = useState<ColumnKey | null>(null);
  const [newTaskText, setNewTaskText] = useState('');

  const totalActive = tasks.todo.length + tasks.inProgress.length;

  const addTask = (col: ColumnKey) => {
    if (!newTaskText.trim()) { setNewTaskInput(null); return; }
    setTasks(prev => ({
      ...prev,
      [col]: [{ id: 'task_new_' + Date.now(), title: newTaskText.trim(), priority: 'medium', assignee: 'RA' }, ...prev[col]],
    }));
    setNewTaskText('');
    setNewTaskInput(null);
  };

  const moveTask = (task: Task, fromCol: ColumnKey, toCol: ColumnKey) => {
    setTasks(prev => ({
      ...prev,
      [fromCol]: prev[fromCol].filter(t => t.id !== task.id),
      [toCol]: [...prev[toCol], task],
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">OmniHub Project Workspace</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            <span className="text-cyan-400 font-semibold">{totalActive}</span> active tasks across all columns
          </p>
        </div>
        <button
          onClick={() => setNewTaskInput('todo')}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus size={15} />
          Add Task
        </button>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
            {/* Column header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Icon size={14} className={color} />
                <span className="text-sm font-semibold text-white">{label}</span>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full min-w-[22px] text-center font-medium">
                  {tasks[key].length}
                </span>
              </div>
              <button
                onClick={() => setNewTaskInput(key)}
                className="text-slate-600 hover:text-cyan-400 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Tasks */}
            <div className="flex-1 p-3 space-y-2.5 overflow-y-auto min-h-[200px]">
              {/* New task input */}
              {newTaskInput === key && (
                <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-3">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Task title..."
                    value={newTaskText}
                    onChange={e => setNewTaskText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') addTask(key);
                      if (e.key === 'Escape') { setNewTaskInput(null); setNewTaskText(''); }
                    }}
                    className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => addTask(key)}
                      className="text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-3 py-1 rounded-lg transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => { setNewTaskInput(null); setNewTaskText(''); }}
                      className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {tasks[key].map(task => {
                const pc = priorityConfig[task.priority];
                const otherCols = columns.filter(c => c.key !== key);
                return (
                  <div
                    key={task.id}
                    className="bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 rounded-xl p-3.5 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <p className="text-xs font-medium text-slate-200 leading-relaxed flex-1">{task.title}</p>
                      <span className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${pc.color}`}>
                        <Flag size={8} />
                        {pc.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-cyan-400">{task.assignee}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {otherCols.map(col => (
                          <button
                            key={col.key}
                            onClick={() => moveTask(task, key, col.key)}
                            className="text-[10px] text-slate-500 hover:text-cyan-400 bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded-lg transition-all"
                          >
                            → {col.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {tasks[key].length === 0 && newTaskInput !== key && (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-600">No tasks here</p>
                  <button
                    onClick={() => setNewTaskInput(key)}
                    className="text-xs text-slate-600 hover:text-cyan-400 mt-1 transition-colors"
                  >
                    + Add one
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
