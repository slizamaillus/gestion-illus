import { useState } from 'react';
import { Users, Plus, MoreHorizontal, Mail, Settings, UserPlus, Shield, X, Check } from 'lucide-react';
import { users, teams as initialTeams } from '../data/mock';
import { clsx } from 'clsx';
import { Team } from '../types';

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveTeam = (updatedTeam: Team) => {
    setTeams(teams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
    setEditingTeam(null);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Equipos</h1>
          <p className="text-slate-500 mt-1">Administra los grupos y departamentos de trabajo.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={16} />
          Nuevo Equipo
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6 shrink-0">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar equipos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-8">
        {filteredTeams.map(team => (
          <div key={team.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">{team.name}</h3>
                  <span className="text-xs font-medium text-slate-500">{team.memberIds.length} miembros</span>
                </div>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setOpenMenuId(openMenuId === team.id ? null : team.id)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <MoreHorizontal size={18} />
                </button>
                {openMenuId === team.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                      <button 
                        onClick={() => {
                          setEditingTeam(team);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                      >
                        <Settings size={14} /> Editar equipo
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <p className="text-slate-600 text-sm mb-6 flex-1">{team.description}</p>
            
            <div className="border-t border-slate-100 pt-4 mt-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Miembros</span>
                <button 
                  onClick={() => setEditingTeam(team)}
                  className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <UserPlus size={14} /> Añadir
                </button>
              </div>
              
              <div className="space-y-2">
                {team.memberIds.map((memberId) => {
                  const user = users.find(u => u.id === memberId);
                  if (!user) return null;
                  return (
                    <div key={memberId} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full border border-slate-200" />
                        <span className="text-sm font-medium text-slate-700">{user.name}</span>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-colors">
                        {team.roles[memberId] || 'Miembro'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        
        {filteredTeams.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No se encontraron equipos que coincidan con tu búsqueda.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-slate-800">Editar Equipo</h2>
              <button 
                onClick={() => setEditingTeam(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del equipo</label>
                  <input 
                    type="text" 
                    value={editingTeam.name}
                    onChange={(e) => setEditingTeam({...editingTeam, name: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
                  <textarea 
                    value={editingTeam.description}
                    onChange={(e) => setEditingTeam({...editingTeam, description: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none h-20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Miembros del equipo</label>
                <div className="space-y-2 border border-slate-200 rounded-lg p-2 bg-slate-50">
                  {users.map(user => {
                    const isMember = editingTeam.memberIds.includes(user.id);
                    return (
                      <div 
                        key={user.id} 
                        className={clsx(
                          "flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer",
                          isMember ? "bg-white shadow-sm border border-slate-200" : "hover:bg-slate-100 border border-transparent"
                        )}
                        onClick={() => {
                          const newMemberIds = isMember 
                            ? editingTeam.memberIds.filter(id => id !== user.id)
                            : [...editingTeam.memberIds, user.id];
                          setEditingTeam({ ...editingTeam, memberIds: newMemberIds });
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                            isMember ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                          )}>
                            {isMember && <Check size={14} />}
                          </div>
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200" />
                          <div>
                            <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                        {isMember && (
                          <div onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="text"
                              placeholder="Rol (ej. Miembro)"
                              value={editingTeam.roles[user.id] || ''}
                              onChange={(e) => {
                                setEditingTeam({
                                  ...editingTeam,
                                  roles: { ...editingTeam.roles, [user.id]: e.target.value }
                                });
                              }}
                              className="text-xs px-2 py-1 border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 w-32"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setEditingTeam(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleSaveTeam(editingTeam)}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
