import { useState } from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';
import { LayoutGrid, List as ListIcon, Calendar, Filter, Plus, Search, Users, Star, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { projects, stages, tasks, currentUser } from '../data/mock';
import KanbanBoard from '../components/tasks/KanbanBoard';
import ProjectDetailsView from '../components/projects/ProjectDetailsView';

type ViewMode = 'board' | 'list' | 'calendar' | 'details';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [view, setView] = useState<ViewMode>('board');
  
  // For demo, just grab the first project if no param
  const project = projects.find(p => p.id === projectId) || projects[0];
  const projectStages = stages.filter(s => s.projectId === project.id);
  const projectTasks = tasks.filter(t => t.projectId === project.id);

  // Read initial starred status from mock (purely visual for this component)
  const isStarred = currentUser.starredProjectIds?.includes(project.id);

  if (!project) return <div>Proyecto no encontrado</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Project Header */}
      <div className="flex items-start justify-between shrink-0 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded">
              {project.visibleId}
            </span>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              {project.name}
              <button className="text-slate-300 hover:text-amber-400 transition-colors focus:outline-none ml-1 group">
                <Star size={20} className={clsx(isStarred ? "fill-amber-400 text-amber-400" : "group-hover:fill-amber-100")} />
              </button>
            </h1>
          </div>
          <p className="text-slate-500 text-sm max-w-2xl">{project.description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
            {project.memberIds.map(mid => (
              <img key={mid} src={`https://i.pravatar.cc/150?u=${mid}`} alt="Member" className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" title={mid} />
            ))}
            <button className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400 bg-white z-10 relative">
              <Plus size={14} />
            </button>
          </div>
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
            <Plus size={16} />
            Nueva Tarea
          </button>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 shrink-0 pb-px">
        <div className="flex gap-6">
          <button 
            onClick={() => setView('board')}
            className={clsx(
              "pb-3 text-sm font-medium transition-colors relative",
              view === 'board' ? "text-rose-700" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid size={16} /> Tablero
            </div>
            {view === 'board' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-700 rounded-t-full" />}
          </button>
          <button 
            onClick={() => setView('list')}
            className={clsx(
              "pb-3 text-sm font-medium transition-colors relative",
              view === 'list' ? "text-rose-700" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <div className="flex items-center gap-2">
              <ListIcon size={16} /> Lista
            </div>
            {view === 'list' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-700 rounded-t-full" />}
          </button>
          <button 
            onClick={() => setView('calendar')}
            className={clsx(
              "pb-3 text-sm font-medium transition-colors relative",
              view === 'calendar' ? "text-rose-700" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <div className="flex items-center gap-2">
              <Calendar size={16} /> Calendario
            </div>
            {view === 'calendar' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-700 rounded-t-full" />}
          </button>
          <button 
            onClick={() => setView('details')}
            className={clsx(
              "pb-3 text-sm font-medium transition-colors relative",
              view === 'details' ? "text-rose-700" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <div className="flex items-center gap-2">
              <FileText size={16} /> Detalles
            </div>
            {view === 'details' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-700 rounded-t-full" />}
          </button>
        </div>

        <div className="flex items-center gap-3 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Buscar tareas..." 
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-600 w-48"
            />
          </div>
          <button className="flex items-center gap-2 text-slate-600 border border-slate-200 rounded-md px-3 py-1.5 text-sm hover:bg-slate-50 transition-colors">
            <Filter size={14} /> Filtros
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden pt-6">
        {view === 'board' && <KanbanBoard stages={projectStages} tasks={projectTasks} />}
        {view === 'list' && <div className="text-center py-20 text-slate-500">Vista de lista en desarrollo</div>}
        {view === 'calendar' && <div className="text-center py-20 text-slate-500">Vista de calendario en desarrollo</div>}
        {view === 'details' && <ProjectDetailsView project={project} />}
      </div>

      <Outlet />
    </div>
  );
}
