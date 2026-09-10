import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, parseISO, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { tasks, projects } from '../data/mock';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800 capitalize">
            {format(currentDate, dateFormat, { locale: es })}
          </h2>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <button onClick={prevMonth} className="p-2 text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="w-px h-5 bg-slate-200"></div>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Hoy
            </button>
            <div className="w-px h-5 bg-slate-200"></div>
            <button onClick={nextMonth} className="p-2 text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 shrink-0">
          {weekDays.map(day => (
            <div key={day} className="px-2 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Days Cells */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-auto overflow-y-auto">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isTodayDate = isSameDay(day, new Date());
            
            // Find tasks for this day
            const dayTasks = tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day));

            return (
              <div 
                key={day.toString()} 
                className={clsx(
                  "min-h-[120px] p-2 border-b border-r border-slate-100 transition-colors",
                  !isCurrentMonth ? "bg-slate-50/50" : "bg-white",
                  idx % 7 === 6 ? "border-r-0" : ""
                )}
              >
                <div className="flex justify-end mb-2">
                  <span className={clsx(
                    "text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full",
                    isTodayDate ? "bg-rose-700 text-white shadow-md" : 
                    isCurrentMonth ? "text-slate-700" : "text-slate-400"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {dayTasks.map(task => {
                    const project = projects.find(p => p.id === task.projectId);
                    return (
                      <Link
                        key={task.id}
                        to={`/projects/${project?.id}/tasks/${task.id}`}
                        className="block px-2 py-1.5 text-[11px] font-medium leading-tight rounded-md truncate transition-colors border shadow-sm cursor-pointer hover:shadow"
                        style={{
                           // Simplistic color mapping for demo purposes
                           backgroundColor: 'var(--color-slate-50)',
                           borderColor: 'var(--color-slate-200)',
                           color: 'var(--color-slate-700)'
                        }}
                        title={`${task.title} - ${project?.name}`}
                      >
                        <div className="font-bold mb-0.5 truncate">{task.title}</div>
                        <div className="text-[9px] text-slate-500 truncate">{project?.name}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
