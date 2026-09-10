import { notifications, users, tasks } from '../data/mock';
import { Bell, CheckSquare, MessageSquare, AlertCircle, Clock, CalendarDays, AtSign } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export default function Notifications() {
  
  const getIconForType = (type: string) => {
    switch(type) {
      case 'mentioned': return <AtSign size={16} className="text-rose-700" />;
      case 'assigned': return <CheckSquare size={16} className="text-emerald-600" />;
      case 'status_changed': return <AlertCircle size={16} className="text-orange-600" />;
      case 'commented': return <MessageSquare size={16} className="text-rose-700" />;
      case 'overdue': return <Clock size={16} className="text-red-600" />;
      case 'date_changed': return <CalendarDays size={16} className="text-purple-600" />;
      default: return <Bell size={16} className="text-slate-600" />;
    }
  };

  const getBgForType = (type: string) => {
    switch(type) {
      case 'mentioned': return 'bg-rose-100 border-rose-200';
      case 'assigned': return 'bg-emerald-100 border-emerald-200';
      case 'status_changed': return 'bg-orange-100 border-orange-200';
      case 'commented': return 'bg-rose-100 border-rose-200';
      case 'overdue': return 'bg-red-100 border-red-200';
      case 'date_changed': return 'bg-purple-100 border-purple-200';
      default: return 'bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notificaciones</h1>
          <p className="text-slate-500 mt-1">Mantente al tanto de la actividad importante.</p>
        </div>
        <button className="text-sm font-medium text-rose-700 hover:text-rose-800 bg-rose-50 px-4 py-2 rounded-lg transition-colors">
          Marcar todas como leídas
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Bell size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-700">Estás al día</p>
            <p className="text-sm mt-1">No tienes nuevas notificaciones.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map(notification => {
              const actor = users.find(u => u.id === notification.actorId);
              const task = tasks.find(t => t.id === notification.taskId);
              const timeAgo = formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true, locale: es });

              return (
                <div 
                  key={notification.id} 
                  className={clsx(
                    "p-5 flex gap-4 hover:bg-slate-50 transition-colors group",
                    !notification.read ? "bg-rose-50/30" : ""
                  )}
                >
                  <div className="relative shrink-0 mt-1">
                    <img 
                      src={actor?.avatar} 
                      alt={actor?.name} 
                      className="w-10 h-10 rounded-full border border-slate-200" 
                    />
                    <div className={clsx(
                      "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white",
                      getBgForType(notification.type)
                    )}>
                      {getIconForType(notification.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug mb-1">
                      <span className="font-semibold text-slate-900">{actor?.name}</span>{' '}
                      {notification.message}
                    </p>
                    
                    {task && (
                      <Link 
                        to={`/projects/${task.projectId}/tasks/${task.id}`}
                        className="inline-block px-3 py-2 mt-2 text-sm bg-white border border-slate-200 rounded-lg font-medium text-slate-700 shadow-sm hover:border-rose-400 hover:text-rose-800 transition-colors"
                      >
                        {task.title}
                      </Link>
                    )}

                    <div className="mt-2 text-xs font-medium text-slate-400">
                      {timeAgo}
                    </div>
                  </div>

                  {!notification.read && (
                    <div className="shrink-0 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-rose-700 rounded-full" title="No leída"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
