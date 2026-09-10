import { useState } from 'react';
import { Stage, Task } from '../../types';
import { MessageSquare, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { users } from '../../data/mock';

type KanbanBoardProps = {
  stages: Stage[];
  tasks: Task[];
};

export default function KanbanBoard({ stages, tasks: initialTasks }: KanbanBoardProps) {
  // We use local state to allow immediate visual updates for drag/drop feel,
  // even if it's just click-to-move for this prototype
  const [tasks, setTasks] = useState(initialTasks);
  const [menuOpenForStage, setMenuOpenForStage] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'low': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4 snap-x">
      {stages.sort((a, b) => a.position - b.position).map(stage => {
        const stageTasks = tasks.filter(t => t.stageId === stage.id);
        
        return (
          <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col max-h-full snap-start">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className={clsx("px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider", stage.color)}>
                  {stage.name}
                </div>
                <span className="text-slate-400 text-sm font-medium">{stageTasks.length}</span>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setMenuOpenForStage(menuOpenForStage === stage.id ? null : stage.id)}
                  className="text-slate-400 hover:text-slate-700 font-bold w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 transition-colors"
                >
                  +
                </button>
                {menuOpenForStage === stage.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setMenuOpenForStage(null)}
                    />
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                      <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        Clonar columna
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        Agregar a la izquierda
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        Agregar a la derecha
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Tasks Container */}
            <div className="flex-1 overflow-y-auto space-y-3 min-h-[150px] p-1 rounded-xl bg-slate-50/50 border border-slate-100">
              {stageTasks.map(task => {
                const assignee = users.find(u => u.id === task.assigneeId);
                const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                const totalSubtasks = task.subtasks.length;
                const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));

                return (
                  <Link 
                    key={task.id} 
                    to={`/projects/${task.projectId}/tasks/${task.id}`}
                    className="block bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={clsx(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                        getPriorityColor(task.priority)
                      )}>
                        {getPriorityLabel(task.priority)}
                      </span>
                      <span className="text-xs font-medium text-slate-400">{task.visibleId}</span>
                    </div>
                    
                    <h4 className="font-semibold text-slate-800 leading-snug mb-3 group-hover:text-rose-700 transition-colors">
                      {task.title}
                    </h4>

                    {/* Progress Bar for subtasks if they exist */}
                    {totalSubtasks > 0 && (
                      <div className="mb-4">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5">
                          <div 
                            className={clsx("h-1.5 rounded-full", completedSubtasks === totalSubtasks ? "bg-emerald-500" : "bg-rose-600")}
                            style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                      
                      {/* Icons (Date, Comments, Subtasks) */}
                      <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                        {task.dueDate && (
                          <div className={clsx("flex items-center gap-1", isOverdue ? "text-red-500 font-semibold" : "")}>
                            {isOverdue ? <AlertCircle size={14} /> : <Clock size={14} />}
                            <span>{format(parseISO(task.dueDate), "d MMM", { locale: es })}</span>
                          </div>
                        )}
                        
                        {task.comments.length > 0 && (
                          <div className="flex items-center gap-1 hover:text-slate-600">
                            <MessageSquare size={14} />
                            <span>{task.comments.length}</span>
                          </div>
                        )}
                        
                        {totalSubtasks > 0 && (
                          <div className={clsx(
                            "flex items-center gap-1",
                            completedSubtasks === totalSubtasks ? "text-emerald-600" : ""
                          )}>
                            <CheckSquare size={14} />
                            <span>{completedSubtasks}/{totalSubtasks}</span>
                          </div>
                        )}
                      </div>

                      {/* Assignee Avatar */}
                      {assignee ? (
                        <img 
                          src={assignee.avatar} 
                          alt={assignee.name} 
                          title={assignee.name}
                          className="w-6 h-6 rounded-full border border-slate-200" 
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-300 bg-slate-50">
                          <Users size={12} />
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
              
              {/* Drop target visualization / empty state */}
              {stageTasks.length === 0 && (
                <div className="h-24 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                  Arrastra tareas aquí
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
