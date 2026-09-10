import { Search, Bell } from 'lucide-react';
import { notifications } from '../../data/mock';
import { Link } from 'react-router-dom';

export default function Topbar() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar tareas, proyectos, portafolios..." 
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <Link to="/notifications" className="relative p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          )}
        </Link>
      </div>
    </header>
  );
}
