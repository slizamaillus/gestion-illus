import { useState } from 'react';
import { portfolios as initialPortfolios, projects, teams } from '../data/mock';
import { Briefcase, MoreHorizontal, FolderKanban, Plus, Search, GripVertical, LayoutGrid, List as ListIcon, Settings, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SortableProjectProps = {
  project: typeof projects[0];
};

function SortablePortfolioProject({ project }: SortableProjectProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={clsx("touch-none relative group/item", isDragging && "shadow-md bg-white rounded-lg")}>
      <Link 
        to={`/projects/${project.id}`}
        className="flex items-center justify-between p-2 pl-7 -mx-2 rounded-lg hover:bg-slate-50 transition-colors group"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <FolderKanban size={14} className="text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-700 group-hover:text-rose-700 truncate">{project.name}</span>
        </div>
        <span className={clsx(
          "text-[10px] font-bold px-2 py-0.5 rounded-full",
          project.status === 'on_track' ? "bg-emerald-50 text-emerald-700" :
          project.status === 'at_risk' ? "bg-red-50 text-red-700" :
          project.status === 'planning' ? "bg-slate-100 text-slate-600" :
          "bg-rose-50 text-rose-800"
        )}>
          {project.progress}%
        </span>
      </Link>
      
      {/* Drag handle */}
      <button 
        {...attributes} 
        {...listeners} 
        className="absolute left-0 top-1/2 -translate-y-1/2 p-1 text-slate-300 opacity-0 group-hover/item:opacity-100 hover:text-slate-500 cursor-grab active:cursor-grabbing transition-opacity"
      >
        <GripVertical size={14} />
      </button>
    </div>
  );
}

type PortfolioProps = { 
  portfolio: typeof initialPortfolios[0];
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  onEdit: (portfolio: typeof initialPortfolios[0]) => void;
  onDelete: (id: string) => void;
};

function PortfolioCard({ portfolio, openMenuId, setOpenMenuId, onEdit, onDelete }: PortfolioProps) {
  const [projectIds, setProjectIds] = useState(portfolio.projectIds);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setProjectIds((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const portfolioProjects = projectIds.map(id => projects.find(p => p.id === id)).filter(Boolean) as typeof projects;
  const avgProgress = portfolioProjects.length 
    ? Math.round(portfolioProjects.reduce((acc, p) => acc + p.progress, 0) / portfolioProjects.length) 
    : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg">
            <Briefcase size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">{portfolio.visibleId}</span>
            <h3 className="text-lg font-bold text-slate-800 leading-tight">{portfolio.name}</h3>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setOpenMenuId(openMenuId === portfolio.id ? null : portfolio.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-50"
          >
            <MoreHorizontal size={18} />
          </button>
          {openMenuId === portfolio.id && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setOpenMenuId(null)}
              />
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                <button 
                  onClick={() => {
                    onEdit(portfolio);
                    setOpenMenuId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Settings size={14} /> Editar
                </button>
                <button 
                  onClick={() => {
                    onDelete(portfolio.id);
                    setOpenMenuId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
        {portfolio.description}
      </p>

      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="font-medium text-slate-600">Progreso general</span>
          <span className="font-bold text-slate-800">{avgProgress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-rose-700 h-2 rounded-full transition-all" style={{ width: `${avgProgress}%` }}></div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Proyectos ({portfolioProjects.length})
        </h4>
        
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={portfolioProjects.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {portfolioProjects.slice(0, 3).map(project => (
                <SortablePortfolioProject key={project.id} project={project} />
              ))}
              {portfolioProjects.length > 3 && (
                <div className="text-xs text-center text-slate-500 font-medium pt-2">
                  + {portfolioProjects.length - 3} proyectos más
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

type PortfolioListItemProps = PortfolioProps & { density?: 'compact' | 'standard' | 'relaxed' };

function PortfolioListItem({ portfolio, density = 'standard', openMenuId, setOpenMenuId, onEdit, onDelete }: PortfolioListItemProps) {
  const portfolioProjects = portfolio.projectIds.map(id => projects.find(p => p.id === id)).filter(Boolean) as typeof projects;
  const avgProgress = portfolioProjects.length 
    ? Math.round(portfolioProjects.reduce((acc, p) => acc + p.progress, 0) / portfolioProjects.length) 
    : 0;

  return (
    <div className={clsx(
      "bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow flex items-center",
      density === 'compact' ? "p-3 gap-4" : 
      density === 'relaxed' ? "p-6 gap-8" : 
      "p-4 gap-6"
    )}>
      <div className={clsx("flex items-center", density === 'compact' ? "gap-3 min-w-[200px]" : "gap-4 min-w-[250px]")}>
        <div className={clsx(
          "bg-rose-50 text-rose-700 rounded-lg shrink-0",
          density === 'compact' ? "p-2" : 
          density === 'relaxed' ? "p-3" : 
          "p-2.5"
        )}>
          <Briefcase size={density === 'compact' ? 16 : density === 'relaxed' ? 24 : 20} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className={clsx("font-bold text-slate-400 bg-slate-100 rounded", density === 'compact' ? "text-[10px] px-1 py-0.5" : "text-xs px-1.5 py-0.5")}>
              {portfolio.visibleId}
            </span>
            <h3 
              className={clsx(
                "font-bold text-slate-800 leading-tight truncate max-w-[24ch]",
                density === 'compact' ? "text-sm" : 
                density === 'relaxed' ? "text-lg" : 
                "text-base"
              )}
              title={portfolio.name}
            >
              {portfolio.name}
            </h3>
          </div>
          <p className="text-slate-500 text-xs truncate max-w-[200px]">{portfolio.description}</p>
        </div>
      </div>
      
      <div className={clsx("flex-1 flex items-center", density === 'compact' ? "gap-4" : "gap-6")}>
        <div className="flex-1 max-w-[200px]">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-slate-600">Progreso</span>
            <span className="font-bold text-slate-800">{avgProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-rose-700 h-1.5 rounded-full transition-all" style={{ width: `${avgProgress}%` }}></div>
          </div>
        </div>
        
        <div className="hidden md:flex flex-wrap gap-2 flex-1">
          {portfolioProjects.slice(0, 3).map(project => (
            <Link 
              key={project.id}
              to={`/projects/${project.id}`}
              className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded-md hover:bg-rose-50 hover:border-rose-200 transition-colors group"
            >
              <FolderKanban size={12} className="text-slate-400 group-hover:text-rose-600" />
              <span className="text-xs font-medium text-slate-600 group-hover:text-rose-700 truncate max-w-[120px]">{project.name}</span>
            </Link>
          ))}
          {portfolioProjects.length > 3 && (
            <span className="text-xs font-medium text-slate-400 self-center">
              +{portfolioProjects.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 pl-4 border-l border-slate-100 relative">
        <button 
          onClick={() => setOpenMenuId(openMenuId === portfolio.id ? null : portfolio.id)}
          className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <MoreHorizontal size={18} />
        </button>
        {openMenuId === portfolio.id && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setOpenMenuId(null)}
            />
            <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
              <button 
                onClick={() => {
                  onEdit(portfolio);
                  setOpenMenuId(null);
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Settings size={14} /> Editar
              </button>
              <button 
                onClick={() => {
                  onDelete(portfolio.id);
                  setOpenMenuId(null);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Portfolios() {
  const [portfoliosList, setPortfoliosList] = useState(initialPortfolios);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [listDensity, setListDensity] = useState<'compact' | 'standard' | 'relaxed'>('standard');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<typeof initialPortfolios[0] | null>(null);

  const handleSavePortfolio = (updatedPortfolio: typeof initialPortfolios[0]) => {
    setPortfoliosList(portfoliosList.map(p => p.id === updatedPortfolio.id ? updatedPortfolio : p));
    setEditingPortfolio(null);
  };

  const handleDeletePortfolio = (id: string) => {
    setPortfoliosList(portfoliosList.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Portafolios</h1>
          <p className="text-slate-500 mt-1">Agrupaciones estratégicas de proyectos.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={16} />
          Nuevo Portafolio
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 shrink-0 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar portafolios..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-600"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {viewMode === 'list' && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setListDensity('compact')}
                className={clsx("px-2.5 py-1 text-xs rounded-md font-medium transition-all", listDensity === 'compact' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}
              >Compacto</button>
              <button
                onClick={() => setListDensity('standard')}
                className={clsx("px-2.5 py-1 text-xs rounded-md font-medium transition-all", listDensity === 'standard' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}
              >Normal</button>
              <button
                onClick={() => setListDensity('relaxed')}
                className={clsx("px-2.5 py-1 text-xs rounded-md font-medium transition-all", listDensity === 'relaxed' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}
              >Amplio</button>
            </div>
          )}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button 
              onClick={() => setViewMode('grid')}
              className={clsx(
                "p-1.5 rounded-md transition-all flex items-center justify-center",
                viewMode === 'grid' ? "bg-white shadow-sm text-rose-700" : "text-slate-500 hover:text-slate-700"
              )}
              title="Vista de cuadrícula"
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={clsx(
                "p-1.5 rounded-md transition-all flex items-center justify-center",
                viewMode === 'list' ? "bg-white shadow-sm text-rose-700" : "text-slate-500 hover:text-slate-700"
              )}
              title="Vista de lista"
            >
              <ListIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-8">
          {portfoliosList.map(portfolio => (
            <PortfolioCard 
              key={portfolio.id} 
              portfolio={portfolio} 
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              onEdit={setEditingPortfolio}
              onDelete={handleDeletePortfolio}
            />
          ))}
        </div>
      ) : (
        <div className={clsx(
          "flex flex-col overflow-y-auto pb-8",
          listDensity === 'compact' ? "gap-2" : 
          listDensity === 'relaxed' ? "gap-4" : 
          "gap-3"
        )}>
          {portfoliosList.map(portfolio => (
            <PortfolioListItem 
              key={portfolio.id} 
              portfolio={portfolio} 
              density={listDensity} 
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              onEdit={setEditingPortfolio}
              onDelete={handleDeletePortfolio}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-slate-800">Configuración del Portafolio</h2>
              <button 
                onClick={() => setEditingPortfolio(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nombre</label>
                <input 
                  type="text" 
                  value={editingPortfolio.name}
                  onChange={(e) => setEditingPortfolio({...editingPortfolio, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
                <textarea 
                  value={editingPortfolio.description}
                  onChange={(e) => setEditingPortfolio({...editingPortfolio, description: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Equipo a cargo</label>
                <select 
                  value={editingPortfolio.teamId || ''}
                  onChange={(e) => setEditingPortfolio({...editingPortfolio, teamId: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-600 cursor-pointer"
                >
                  <option value="">Sin equipo asignado</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between shrink-0">
              <button 
                onClick={() => {
                  handleDeletePortfolio(editingPortfolio.id);
                  setEditingPortfolio(null);
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Eliminar
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={() => setEditingPortfolio(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleSavePortfolio(editingPortfolio)}
                  className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
