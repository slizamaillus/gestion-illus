import { useState } from 'react';
import { Project } from '../../types';
import { users, portfolios } from '../../data/mock';
import { Users, Briefcase, Plus, UserPlus } from 'lucide-react';

interface ProjectDetailsViewProps {
  project: Project;
}

export default function ProjectDetailsView({ project }: ProjectDetailsViewProps) {
  const [description, setDescription] = useState(project.description);
  
  const connectedPortfolios = portfolios.filter(p => p.projectIds.includes(project.id));
  
  const [projectRoles, setProjectRoles] = useState<{userId: string, role: string}[]>(
    project.memberIds.map(id => ({ userId: id, role: id === project.ownerId ? 'Propietario' : 'Miembro' }))
  );
  
  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full overflow-y-auto pr-2 pb-8">
      {/* Columna Principal */}
      <div className="flex-1 space-y-8 min-w-0">
        {/* Descripción del proyecto */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Descripción del proyecto</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none transition-colors"
            placeholder="Añade una descripción para este proyecto..."
          />
        </section>

        {/* Roles del proyecto */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users size={18} className="text-slate-500" /> Roles del proyecto
            </h2>
            <button className="text-sm font-medium text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
              <UserPlus size={14} /> Añadir miembro
            </button>
          </div>
          
          <div className="space-y-3">
            {projectRoles.map((pr, i) => {
              const user = users.find(u => u.id === pr.userId);
              if (!user) return null;
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-slate-200" />
                    <div>
                      <div className="font-semibold text-sm text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <select 
                    value={pr.role}
                    onChange={(e) => {
                      const newRoles = [...projectRoles];
                      newRoles[i].role = e.target.value;
                      setProjectRoles(newRoles);
                    }}
                    className="text-sm border border-slate-200 rounded-md bg-white py-1 px-2 text-slate-700 shadow-sm focus:ring-rose-600 focus:border-rose-600 outline-none cursor-pointer"
                  >
                    <option value="Propietario">Propietario</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Líder de diseño">Líder de diseño</option>
                    <option value="Líder técnico">Líder técnico</option>
                    <option value="Miembro">Miembro</option>
                    <option value="Observador">Observador</option>
                  </select>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Columna Secundaria (Sidebar) */}
      <div className="lg:w-80 shrink-0 space-y-6">
        <section className="bg-slate-50 rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Briefcase size={16} className="text-slate-500" /> Portafolios conectados
          </h2>
          
          {connectedPortfolios.length > 0 ? (
            <div className="space-y-2">
              {connectedPortfolios.map(portfolio => (
                <div key={portfolio.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                    <Briefcase size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-800 truncate">{portfolio.name}</div>
                    <div className="text-xs text-slate-500">{portfolio.visibleId}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Este proyecto no está conectado a ningún portafolio.</p>
          )}
          <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 border border-dashed border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors text-sm font-medium">
            <Plus size={16} /> Conectar a portafolio
          </button>
        </section>
      </div>
    </div>
  );
}
