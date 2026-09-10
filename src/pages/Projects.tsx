import { projects, users } from '../data/mock';
import { FolderKanban, Search, Filter, Plus, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Projects() {
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'on_track': return { label: 'En curso', color: 'bg-emerald-100 text-emerald-800' };
      case 'at_risk': return { label: 'En riesgo', color: 'bg-red-100 text-red-800' };
      case 'delayed': return { label: 'Retrasado', color: 'bg-orange-100 text-orange-800' };
      case 'planning': return { label: 'Planificación', color: 'bg-slate-100 text-slate-800' };
      case 'completed': return { label: 'Completado', color: 'bg-rose-100 text-rose-900' };
      default: return { label: status, color: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Proyectos</h1>
          <p className="text-slate-500 mt-1">Todos los proyectos activos de la organización.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={16} />
          Nuevo Proyecto
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o ID..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-600"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <Filter size={16} />
          Filtros
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">Proyecto</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Progreso</th>
                <th className="px-6 py-4">Responsable</th>
                <th className="px-6 py-4">Fecha Límite</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {projects.map(project => {
                const owner = users.find(u => u.id === project.ownerId);
                const status = getStatusConfig(project.status);
                
                return (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-rose-50 group-hover:text-rose-700 transition-colors">
                          <FolderKanban size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{project.visibleId}</span>
                          </div>
                          <Link to={`/projects/${project.id}`} className="font-semibold text-slate-800 hover:text-rose-700 mt-0.5 block">
                            {project.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold", status.color)}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 w-48">
                        <span className="font-medium text-slate-600 min-w-[3ch] text-right">{project.progress}%</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2">
                          <div 
                            className={clsx(
                              "h-2 rounded-full",
                              project.status === 'completed' ? "bg-rose-600" :
                              project.status === 'at_risk' ? "bg-red-500" : "bg-emerald-500"
                            )} 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {owner && (
                        <div className="flex items-center gap-2">
                          <img src={owner.avatar} alt={owner.name} className="w-6 h-6 rounded-full border border-slate-200" />
                          <span className="text-slate-700 font-medium">{owner.name.split(' ')[0]}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {project.dueDate ? format(parseISO(project.dueDate), "d MMM, yyyy", { locale: es }) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
