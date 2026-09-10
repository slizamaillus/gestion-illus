import { subDays, addDays, subHours, subMinutes, formatISO } from 'date-fns';
import { User, Portfolio, Project, Stage, Task, Notification, Team } from '../types';

const now = new Date();

export const teams: Team[] = [
  {
    id: 't1',
    name: 'Desarrollo Frontend',
    description: 'Equipo encargado de la interfaz de usuario y experiencia.',
    memberIds: ['u1', 'u2', 'u3'],
    roles: { 'u1': 'Líder', 'u2': 'Desarrollador Senior', 'u3': 'Desarrollador Junior' }
  },
  {
    id: 't2',
    name: 'Diseño UX/UI',
    description: 'Investigación de usuarios, wireframes y diseño visual.',
    memberIds: ['u1', 'u4'],
    roles: { 'u4': 'Líder de Diseño', 'u1': 'UX Researcher' }
  },
  {
    id: 't3',
    name: 'Marketing',
    description: 'Estrategia de crecimiento y contenido.',
    memberIds: ['u2', 'u4', 'u3'],
    roles: { 'u2': 'Growth Hacker', 'u4': 'Content Creator', 'u3': 'Social Media Manager' }
  }
];

export const users: User[] = [
  { id: 'u1', name: 'María Rodríguez', avatar: 'https://i.pravatar.cc/150?u=u1', email: 'maria@illus.cl', starredProjectIds: ['p1', 'p2'] },
  { id: 'u2', name: 'Juan Pérez', avatar: 'https://i.pravatar.cc/150?u=u2', email: 'juan@illus.cl' },
  { id: 'u3', name: 'Ana Gómez', avatar: 'https://i.pravatar.cc/150?u=u3', email: 'ana@illus.cl' },
  { id: 'u4', name: 'Carlos Silva', avatar: 'https://i.pravatar.cc/150?u=u4', email: 'carlos@illus.cl' },
];

export const currentUser = users[0];

export const projects: Project[] = [
  {
    id: 'p1',
    visibleId: 'PRJ-101',
    name: 'Nuevo sitio web',
    description: 'Rediseño completo de la página principal corporativa.',
    status: 'on_track',
    ownerId: 'u1',
    memberIds: ['u1', 'u2', 'u3'],
    startDate: formatISO(subDays(now, 10)),
    dueDate: formatISO(addDays(now, 20)),
    tags: ['Marketing', 'Web'],
    progress: 45,
  },
  {
    id: 'p2',
    visibleId: 'PRJ-102',
    name: 'Plataforma interna',
    description: 'Desarrollo del nuevo dashboard para empleados.',
    status: 'at_risk',
    ownerId: 'u2',
    memberIds: ['u1', 'u2', 'u4'],
    startDate: formatISO(subDays(now, 30)),
    dueDate: formatISO(addDays(now, 5)),
    tags: ['IT', 'Interno'],
    progress: 80,
  },
  {
    id: 'p3',
    visibleId: 'PRJ-103',
    name: 'Automatización de procesos',
    description: 'Implementación de flujos automáticos para facturación.',
    status: 'planning',
    ownerId: 'u3',
    memberIds: ['u3', 'u4'],
    startDate: formatISO(addDays(now, 5)),
    dueDate: formatISO(addDays(now, 45)),
    tags: ['Finanzas', 'Operaciones'],
    progress: 0,
  },
];

export const portfolios: Portfolio[] = [
  {
    id: 'port1',
    visibleId: 'PTF-01',
    name: 'Transformación Digital',
    description: 'Iniciativas clave para la modernización de la empresa.',
    status: 'active',
    createdAt: formatISO(subDays(now, 60)),
    createdBy: 'u1',
    projectIds: ['p1', 'p2', 'p3'],
  },
  {
    id: 'port2',
    visibleId: 'PTF-02',
    name: 'Proyectos Estratégicos 2026',
    description: 'Alineación con los objetivos anuales.',
    status: 'active',
    createdAt: formatISO(subDays(now, 90)),
    createdBy: 'u2',
    projectIds: ['p1', 'p3'], // Project 1 appears in both!
  }
];

export const stages: Stage[] = [
  // For project 1
  { id: 's1', projectId: 'p1', name: 'Por hacer', position: 0, color: 'bg-slate-200 text-slate-700' },
  { id: 's2', projectId: 'p1', name: 'En progreso', position: 1, color: 'bg-rose-100 text-rose-700' },
  { id: 's3', projectId: 'p1', name: 'En revisión', position: 2, color: 'bg-amber-100 text-amber-700' },
  { id: 's4', projectId: 'p1', name: 'Finalizado', position: 3, color: 'bg-emerald-100 text-emerald-700' },
  // For project 2
  { id: 's5', projectId: 'p2', name: 'Backlog', position: 0, color: 'bg-slate-200 text-slate-700' },
  { id: 's6', projectId: 'p2', name: 'Desarrollo', position: 1, color: 'bg-indigo-100 text-indigo-700' },
  { id: 's7', projectId: 'p2', name: 'QA', position: 2, color: 'bg-purple-100 text-purple-700' },
  { id: 's8', projectId: 'p2', name: 'Desplegado', position: 3, color: 'bg-green-100 text-green-700' },
];

export const tasks: Task[] = [
  {
    id: 't1',
    visibleId: 'TSK-1001',
    title: 'Diseñar wireframes',
    description: 'Crear los wireframes iniciales para la página principal y sección de contacto.',
    projectId: 'p1',
    stageId: 's1',
    assigneeId: 'u3',
    participantIds: ['u1'],
    priority: 'high',
    startDate: formatISO(subDays(now, 2)),
    dueDate: formatISO(addDays(now, 3)),
    tags: ['Diseño', 'UX'],
    subtasks: [
      { id: 'st1', title: 'Página principal', completed: false },
      { id: 'st2', title: 'Contacto', completed: false },
    ],
    comments: [],
    activities: [
      { id: 'a1', userId: 'u1', timestamp: formatISO(subDays(now, 2)), action: 'created', details: 'Tarea creada' }
    ]
  },
  {
    id: 't2',
    visibleId: 'TSK-1002',
    title: 'Definir contenido',
    description: 'Redactar los textos principales alineados a la nueva marca.',
    projectId: 'p1',
    stageId: 's1',
    assigneeId: 'u2',
    participantIds: [],
    priority: 'medium',
    dueDate: formatISO(addDays(now, 5)),
    tags: ['Copywriting'],
    subtasks: [],
    comments: [],
    activities: []
  },
  {
    id: 't3',
    visibleId: 'TSK-1003',
    title: 'Diseño página principal',
    description: 'Diseño en alta fidelidad basado en los wireframes aprobados.',
    projectId: 'p1',
    stageId: 's2',
    assigneeId: 'u3',
    participantIds: ['u1', 'u2'],
    priority: 'high',
    startDate: formatISO(subDays(now, 5)),
    dueDate: formatISO(addDays(now, 1)),
    tags: ['Diseño', 'UI'],
    subtasks: [
      { id: 'st3', title: 'Header y Hero', completed: true },
      { id: 'st4', title: 'Sección servicios', completed: true },
      { id: 'st5', title: 'Footer', completed: false },
    ],
    comments: [
      { id: 'c1', userId: 'u2', createdAt: formatISO(subHours(now, 5)), content: '¿Cómo vamos con el footer? @Ana Gómez' },
      { id: 'c2', userId: 'u3', createdAt: formatISO(subHours(now, 4)), content: 'Casi listo, lo subo hoy en la tarde.' }
    ],
    activities: [
      { id: 'a2', userId: 'u1', timestamp: formatISO(subDays(now, 5)), action: 'created', details: 'Tarea creada' },
      { id: 'a3', userId: 'u3', timestamp: formatISO(subDays(now, 4)), action: 'moved_stage', details: 'Movida a En progreso', oldValue: 'Por hacer', newValue: 'En progreso' },
    ]
  },
  {
    id: 't4',
    visibleId: 'TSK-1004',
    title: 'Revisión de diseño',
    description: 'Revisión general con el cliente interno.',
    projectId: 'p1',
    stageId: 's3',
    assigneeId: 'u1',
    participantIds: ['u3'],
    priority: 'urgent',
    dueDate: formatISO(addDays(now, 2)),
    tags: ['Revisión'],
    subtasks: [],
    comments: [],
    activities: []
  },
  // Overdue task for dashboard
  {
    id: 't5',
    visibleId: 'TSK-2001',
    title: 'Migración de base de datos',
    description: 'Migrar esquema a la nueva estructura.',
    projectId: 'p2',
    stageId: 's6',
    assigneeId: 'u1', // assigned to current user
    participantIds: [],
    priority: 'urgent',
    dueDate: formatISO(subDays(now, 2)), // overdue
    tags: ['Backend', 'DB'],
    subtasks: [],
    comments: [],
    activities: []
  }
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    actorId: 'u2',
    type: 'mentioned',
    taskId: 't3',
    projectId: 'p1',
    message: 'te mencionó en "Diseño página principal"',
    createdAt: formatISO(subHours(now, 2)),
    read: false,
  },
  {
    id: 'n2',
    userId: 'u1',
    actorId: 'u3',
    type: 'assigned',
    taskId: 't4',
    projectId: 'p1',
    message: 'te asignó la tarea "Revisión de diseño"',
    createdAt: formatISO(subDays(now, 1)),
    read: true,
  }
];
