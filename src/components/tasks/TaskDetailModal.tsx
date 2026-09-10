import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  X, 
  User as UserIcon,
  CheckSquare,
  MessageSquare,
  MoreHorizontal,
  Calendar,
  Flag,
  FolderKanban,
  Briefcase
} from 'lucide-react';
import { clsx } from 'clsx';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { tasks, users, projects, stages, portfolios } from '../../data/mock';

export default function TaskDetailModal() {
  const { taskId, projectId } = useParams();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const task = tasks.find(t => t.id === taskId);
  const project = projects.find(p => p.id === projectId);
  
  useEffect(() => {
    // Trigger slide-in animation on mount
    setIsVisible(true);
  }, []);

  if (!task || !project) return null;

  const stage = stages.find(s => s.id === task.stageId);
  const assignee = users.find(u => u.id === task.assigneeId);
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const linkedPortfolios = portfolios.filter(p => p.projectIds.includes(project.id));

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate(-1);
    }, 300); // Wait for transition
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-rose-800 bg-rose-100';
      case 'low': return 'text-slate-700 bg-slate-100';
      default: return 'text-slate-700 bg-slate-100';
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
    <>
      {/* Backdrop */}
      <div 
        className={clsx(
          "fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div 
        className={clsx(
          "fixed inset-y-0 right-0 w-full max-w-md lg:max-w-lg bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
        onClick={handleModalClick}
      >
        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-2 py-1 rounded shadow-sm">
              {task.visibleId}
            </span>
            <div className={clsx("px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider", stage?.color)}>
              {stage?.name}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreHorizontal size={20} />
            </button>
            <div className="w-px h-5 bg-slate-200 mx-1"></div>
            <button 
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Title */}
            <div>
              <textarea 
                className="w-full text-2xl font-bold text-slate-900 leading-tight resize-none border-none focus:ring-0 p-0 bg-transparent"
                defaultValue={task.title}
                rows={2}
                placeholder="Nombre de la tarea"
              />
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              
              {/* Responsable */}
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1.5 flex items-center gap-1.5">
                  <UserIcon size={14} /> Responsable
                </label>
                <div className="mt-1">
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-rose-600 focus:border-rose-600 p-2 cursor-pointer"
                    defaultValue={task.assigneeId || ''}
                  >
                    <option value="">Sin asignar</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1.5 flex items-center gap-1.5">
                  <Calendar size={14} /> Fecha de entrega
                </label>
                <div className="mt-1">
                  <input 
                    type="date"
                    defaultValue={task.dueDate ? task.dueDate.split('T')[0] : ''}
                    className={clsx(
                      "w-full bg-slate-50 border border-slate-200 text-sm rounded-lg focus:ring-rose-600 focus:border-rose-600 p-2",
                      task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)) ? "text-red-600 font-semibold" : "text-slate-800"
                    )}
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1.5 flex items-center gap-1.5">
                  <Flag size={14} /> Prioridad
                </label>
                <div className="mt-1">
                  <select 
                    className={clsx(
                      "w-full bg-slate-50 border border-slate-200 text-sm rounded-lg focus:ring-rose-600 focus:border-rose-600 p-2 cursor-pointer font-semibold",
                      getPriorityColor(task.priority)
                    )}
                    defaultValue={task.priority}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>

              {/* Linked Project */}
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1.5 flex items-center gap-1.5">
                  <FolderKanban size={14} /> Proyecto vinculado
                </label>
                <div className="mt-1">
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-rose-600 focus:border-rose-600 p-2 cursor-pointer"
                    defaultValue={task.projectId}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Linked Portfolios */}
              <div className="col-span-2">
                <label className="text-xs text-slate-500 font-medium mb-1.5 flex items-center gap-1.5">
                  <Briefcase size={14} /> Portafolios vinculados
                </label>
                <div className="mt-1 flex flex-wrap gap-2 items-center">
                  {linkedPortfolios.length > 0 ? (
                    linkedPortfolios.map(port => (
                      <span key={port.id} className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-100 flex items-center gap-1">
                        {port.name}
                        <button className="hover:text-indigo-900 transition-colors ml-1"><X size={12} /></button>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 italic">No asociado a portafolios</span>
                  )}
                  <select 
                    className="text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-md py-1 px-2 focus:ring-rose-600 focus:border-rose-600 cursor-pointer"
                    onChange={(e) => {
                      e.target.value = ''; // Reset select after action
                    }}
                  >
                    <option value="">+ Añadir</option>
                    {portfolios.filter(p => !linkedPortfolios.find(lp => lp.id === p.id)).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-sm font-semibold text-slate-900 mb-3 block">
                Descripción
              </label>
              <textarea 
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-rose-600 focus:ring-1 focus:ring-rose-600 rounded-xl text-sm text-slate-700 resize-none min-h-[100px] transition-colors"
                placeholder="Añadir una descripción detallada..."
                defaultValue={task.description}
              />
            </div>

            {/* Subtasks */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-slate-900">
                  Subtareas <span className="text-slate-400 font-normal ml-1">({completedSubtasks}/{task.subtasks.length})</span>
                </label>
              </div>
              
              <div className="space-y-2">
                {task.subtasks.map(st => (
                  <div key={st.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg group transition-colors border border-transparent hover:border-slate-200">
                    <button className={clsx(
                      "mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors",
                      st.completed 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-slate-300 text-transparent hover:border-emerald-500"
                    )}>
                      <CheckSquare size={14} className={st.completed ? "opacity-100" : "opacity-0"} />
                    </button>
                    <div className="flex-1">
                      <p className={clsx("text-sm", st.completed ? "text-slate-400 line-through" : "text-slate-700 font-medium")}>
                        {st.title}
                      </p>
                    </div>
                  </div>
                ))}
                <button className="flex items-center gap-2 text-sm text-rose-700 hover:text-rose-800 font-medium mt-2 p-2">
                  <span className="text-lg leading-none">+</span> Añadir subtarea
                </button>
              </div>
            </div>

            {/* Comments History */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare size={16} /> Historial de Comentarios
              </label>

              {/* Comment Input */}
              <div className="flex gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-rose-700 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                  {users[0].name[0]}
                </div>
                <div className="flex-1 bg-white border border-slate-300 rounded-xl overflow-hidden focus-within:border-rose-600 focus-within:ring-1 focus-within:ring-rose-600 transition-shadow">
                  <textarea 
                    placeholder="Escribe un comentario..." 
                    className="w-full p-3 text-sm resize-none focus:outline-none min-h-[60px] bg-transparent"
                  ></textarea>
                  <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 flex justify-end">
                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                      Comentar
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-5">
                {task.comments.length === 0 ? (
                  <p className="text-slate-400 italic text-sm text-center py-4">No hay comentarios aún.</p>
                ) : (
                  task.comments.map(comment => {
                    const user = users.find(u => u.id === comment.userId);
                    return (
                      <div key={comment.id} className="flex gap-3">
                        <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border border-slate-200 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-semibold text-slate-900 text-sm">{user?.name}</span>
                            <span className="text-xs text-slate-400">
                              {format(parseISO(comment.createdAt), "d MMM, HH:mm", { locale: es })}
                            </span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded-lg rounded-tl-none p-3 text-sm text-slate-700 leading-relaxed">
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

