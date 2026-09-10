import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  FolderKanban, 
  CheckSquare, 
  CalendarDays, 
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Star,
  GripVertical,
  Users
} from 'lucide-react';
import { clsx } from 'clsx';
import { currentUser, projects } from '../../data/mock';
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

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

type SortableItemProps = {
  project: typeof projects[0];
  isActive: boolean;
  collapsed: boolean;
};

function SortableFavoriteItem({ project, isActive, collapsed }: SortableItemProps) {
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
    <div ref={setNodeRef} style={style} className={clsx("touch-none relative group/item rounded-md", isDragging && "shadow-md bg-white")}>
      <Link
        to={`/projects/${project.id}`}
        className={clsx(
          "flex items-center gap-3 px-2 py-2 rounded-md transition-colors group",
          isActive 
            ? "bg-rose-50 text-rose-800 font-medium" 
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          collapsed ? "justify-center" : ""
        )}
        title={collapsed ? project.name : undefined}
      >
        <Star size={18} className={clsx("shrink-0", isActive ? "text-rose-700 fill-rose-700" : "text-amber-400 fill-amber-400")} />
        {!collapsed && <span className="truncate text-sm flex-1">{project.name}</span>}
      </Link>
      
      {/* Drag handle */}
      {!collapsed && (
        <button 
          {...attributes} 
          {...listeners} 
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-300 opacity-0 group-hover/item:opacity-100 hover:text-slate-500 cursor-grab active:cursor-grabbing transition-opacity"
        >
          <GripVertical size={14} />
        </button>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();
  const [favoriteProjects, setFavoriteProjects] = useState(() => 
    projects.filter(p => currentUser.starredProjectIds?.includes(p.id))
  );

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
      setFavoriteProjects((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const navItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: Briefcase, label: 'Portafolios', path: '/portfolios' },
    { icon: FolderKanban, label: 'Proyectos', path: '/projects' },
    { icon: Users, label: 'Equipos', path: '/teams' },
    { icon: CheckSquare, label: 'Mis tareas', path: '/my-tasks' },
    { icon: CalendarDays, label: 'Calendario', path: '/calendar' },
    { icon: Bell, label: 'Notificaciones', path: '/notifications' },
  ];

  return (
    <aside 
      className={clsx(
        "bg-slate-50 border-r border-slate-200 h-screen flex flex-col transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-16 flex items-center px-4 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2 overflow-hidden justify-center pl-1">
          <div className="flex items-center shrink-0">
            <img 
              src="/logo.png" 
              alt="illus" 
              className={clsx("object-contain transition-all", collapsed ? "h-6" : "h-8")}
              onError={(e) => {
                // Fallback a texto si la imagen no existe en public/
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback tipográfico */}
            <span className="font-bold text-3xl tracking-tighter hidden" style={{ fontFamily: '"Outfit", sans-serif' }}>
              {!collapsed ? (
                <>
                  <span className="text-black">ill</span>
                  <span className="text-[#C41230]">u</span>
                  <span className="text-black">s</span>
                </>
              ) : (
                <span className="text-[#C41230]">u</span>
              )}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-slate-800 shadow-sm z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-6">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                            (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors group",
                  isActive 
                    ? "bg-rose-50 text-rose-800 font-medium" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} className={isActive ? "text-rose-700" : "text-slate-500 group-hover:text-slate-700"} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {favoriteProjects.length > 0 && (
          <div className="px-1">
            {!collapsed && <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Favoritos</h3>}
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={favoriteProjects.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1">
                  {favoriteProjects.map(project => {
                    const isActive = location.pathname.startsWith(`/projects/${project.id}`);
                    return (
                      <SortableFavoriteItem 
                        key={project.id} 
                        project={project} 
                        isActive={isActive} 
                        collapsed={collapsed} 
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 shrink-0">
        <div className={clsx("flex items-center gap-3", collapsed ? "justify-center" : "")}>
          <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full border border-slate-200 shrink-0" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mt-4 text-sm px-1">
            <Settings size={16} />
            <span>Configuración</span>
          </button>
        )}
      </div>
    </aside>
  );
}
