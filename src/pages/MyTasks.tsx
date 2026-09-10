import { tasks, projects, currentUser } from '../data/mock';
import { CheckCircle2, Clock, AlertCircle, Calendar as CalendarIcon, Tag, MoreHorizontal } from 'lucide-react';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { Task } from '../types';

export default function MyTasks() {
  const myTasksList = tasks.filter(t => t.assigneeId === currentUser.id && t.stageId !== 's4' && t.stageId !== 's8'); // Using mock completion stages

  const overdue = myTasksList.filter(t => t.dueDate && isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate)));
  const today = myTasksList.filter(t => t.dueDate && isToday(parseISO(t.dueDate)));
  const upcoming = myTasksList.filter(t => !t.dueDate || (!isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate))));

  const TaskRow = ({ task, isOverdue = false }: { task: Task, isOverdue?: boolean }) => {
    const project = projects.find(p => p.id === task.projectId);
    
    return (
      <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm hover:border-rose-300 transition-all group mb-3">
        <button className="text-slate-300 hover:text-emerald-500 transition-colors shrink-0">
          <CheckCircle2 size={24} />
        </button>
        
        <div className="flex-1 min-w-0">
          <Link to={`/projects/${project?.id}/tasks/${task.id}`} className="block">
            <h4 className="font-semibold text-slate-800 group-hover:text-rose-700 truncate mb-1 text-sm md:text-base">
              {task.title}
            </h4>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-slate-500">
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-500">{task.visibleId}</span>
                <span className="truncate max-w-[150px]">{project?.name}</span>
              </div>
              
              {task.dueDate && (
                <div className={clsx("flex items-center gap-1.5", isOverdue ? "text-red-600" : "text-slate-500")}>
                  {isOverdue ? <AlertCircle size={14} /> : <CalendarIcon size={14} />}
                  <span>{format(parseISO(task.dueDate), "d MMM yyyy", { locale: es })}</span>
                </div>
              )}
              
              {task.priority !== 'low' && (
                <div className={clsx(
                  "flex items-center gap-1.5",
                  task.priority === 'urgent' ? "text-red-600" : 
                  task.priority === 'high' ? "text-orange-600" : "text-rose-700"
                )}>
                  <Tag size={12} />
                  <span className="uppercase text-[10px] tracking-wider font-bold">
                    {task.priority === 'urgent' ? 'Urgente' : task.priority === 'high' ? 'Alta' : 'Media'}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>
        
        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Mis Tareas</h1>
        <p className="text-slate-500 mt-1">Organiza y prioriza tu trabajo pendiente.</p>
      </div>

      <div className="space-y-10">
        
        {overdue.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-slate-800">Vencidas</h2>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{overdue.length}</span>
            </div>
            <div>
              {overdue.map(task => <TaskRow key={task.id} task={task} isOverdue={true} />)}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-slate-800">Para hoy</h2>
            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full">{today.length}</span>
          </div>
          {today.length > 0 ? (
            <div>
              {today.map(task => <TaskRow key={task.id} task={task} />)}
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-slate-600 font-medium">No tienes tareas para hoy.</p>
              <p className="text-slate-400 text-sm mt-1">¡Estás al día con tu trabajo!</p>
            </div>
          )}
        </section>

        {upcoming.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-slate-800">Próximas</h2>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{upcoming.length}</span>
            </div>
            <div>
              {upcoming.map(task => <TaskRow key={task.id} task={task} />)}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
