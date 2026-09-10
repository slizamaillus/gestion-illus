import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  FolderKanban,
  MoreHorizontal
} from 'lucide-react';
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { projects, tasks, currentUser, activities } from '../data/mock';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id);
  const activeProjects = projects.filter(p => p.status !== 'completed' && p.status !== 'planning');
  
  const myPendingTasks = myTasks.filter(t => t.stageId !== 's4' && t.stageId !== 's8'); // Using hardcoded complete stages for simplicity in mock
  const overdueTasks = myPendingTasks.filter(t => t.dueDate && isPast(parseISO(t.dueDate)) && !isToday(parseISO(t.dueDate)));
  
  const stats = [
    { label: 'Tareas pendientes', value: myPendingTasks.length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'En progreso', value: myPendingTasks.filter(t => t.stageId === 's2' || t.stageId === 's6').length, icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Vencidas', value: overdueTasks.length, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Proyectos activos', value: activeProjects.length, icon: FolderKanban, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Buenos días, {currentUser.name.split(' ')[0]}</h1>
        <p className="text-slate-500 mt-1">Aquí está el resumen de tu trabajo para hoy.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
            <div className={clsx("p-3 rounded-lg", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* My Tasks */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Mis tareas prioritarias</h2>
              <Link to="/my-tasks" className="text-sm font-medium text-rose-700 hover:text-rose-800">Ver todas</Link>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              {myPendingTasks.slice(0, 5).map((task, i) => {
                const project = projects.find(p => p.id === task.projectId);
                const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));
                
                return (
                  <div key={task.id} className={clsx(
                    "flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors",
                    i !== 0 ? "border-t border-slate-100" : ""
                  )}>
                    <button className="mt-0.5 text-slate-300 hover:text-emerald-500 transition-colors">
                      <CheckCircle2 size={20} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link to={`/projects/${project?.id}/tasks/${task.id}`} className="font-medium text-slate-800 hover:text-rose-700 truncate">
                          {task.title}
                        </Link>
                        {isOverdue && <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">Vencida</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-medium">{project?.visibleId}</span>
                        <span>&bull;</span>
                        <span className="truncate">{project?.name}</span>
                        {task.dueDate && (
                          <>
                            <span>&bull;</span>
                            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                              {format(parseISO(task.dueDate), "d MMM", { locale: es })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent Projects */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Proyectos activos</h2>
              <Link to="/projects" className="text-sm font-medium text-rose-700 hover:text-rose-800">Ver todos</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeProjects.slice(0, 4).map(project => (
                <Link key={project.id} to={`/projects/${project.id}`} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-rose-300 hover:shadow-sm transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-medium text-slate-500">{project.visibleId}</span>
                      <h3 className="font-semibold text-slate-800 group-hover:text-rose-700 transition-colors">{project.name}</h3>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={18} /></button>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 mb-2">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500">Progreso</span>
                      <span className="font-medium text-slate-700">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-rose-700 h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex -space-x-2">
                      {project.memberIds.slice(0, 3).map(mid => {
                        const m = currentUser.id === mid ? currentUser : { avatar: `https://i.pravatar.cc/150?u=${mid}` };
                        return (
                          <img key={mid} src={m.avatar} alt="Member" className="w-6 h-6 rounded-full border-2 border-white" />
                        );
                      })}
                    </div>
                    {project.memberIds.length > 3 && (
                      <span className="text-xs text-slate-500 font-medium">+{project.memberIds.length - 3}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column (1/3 width) - Recent Activity */}
        <div>
          <section className="bg-white border border-slate-200 rounded-xl p-5 h-full">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Actividad reciente</h2>
            
            <div className="relative border-l border-slate-200 ml-3 space-y-6">
              {/* Fake timeline for demonstration since mock activities are sparse */}
              <div className="relative pl-6">
                <div className="absolute w-2 h-2 bg-slate-300 rounded-full -left-[4.5px] top-1.5 ring-4 ring-white"></div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-slate-800">María Rodríguez</span>
                  <span className="text-slate-500">creó la tarea</span>
                </div>
                <p className="text-sm text-rose-700 mt-0.5">Diseño página principal</p>
                <p className="text-xs text-slate-400 mt-1">Hace 2 horas</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute w-2 h-2 bg-slate-300 rounded-full -left-[4.5px] top-1.5 ring-4 ring-white"></div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-slate-800">Juan Pérez</span>
                  <span className="text-slate-500">movió</span>
                </div>
                <p className="text-sm text-slate-700 mt-0.5">Definir contenido <span className="text-slate-500">a</span> En progreso</p>
                <p className="text-xs text-slate-400 mt-1">Hace 4 horas</p>
              </div>
              
              <div className="relative pl-6">
                <div className="absolute w-2 h-2 bg-slate-300 rounded-full -left-[4.5px] top-1.5 ring-4 ring-white"></div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-slate-800">Ana Gómez</span>
                  <span className="text-slate-500">comentó en</span>
                </div>
                <p className="text-sm text-slate-700 mt-0.5">Diseño página principal</p>
                <div className="mt-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 italic border border-slate-100">
                  "¿Cómo vamos con el footer? @Ana Gómez"
                </div>
                <p className="text-xs text-slate-400 mt-2">Ayer</p>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200">
              Ver toda la actividad
            </button>
          </section>
        </div>

      </div>
    </div>
  );
}
