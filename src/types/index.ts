export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  starredProjectIds?: string[];
};

export type Team = {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  roles: Record<string, string>;
};

export type Portfolio = {
  id: string;
  visibleId: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'planning';
  createdAt: string;
  createdBy: string;
  teamId?: string;
  projectIds: string[];
};

export type ProjectStatus = 'planning' | 'active' | 'on_track' | 'at_risk' | 'delayed' | 'completed';

export type Project = {
  id: string;
  visibleId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  memberIds: string[];
  startDate: string | null;
  dueDate: string | null;
  tags: string[];
  progress: number; // 0-100
};

export type Stage = {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  position: number;
  color: string;
};

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
  dueDate?: string;
};

export type Comment = {
  id: string;
  userId: string;
  createdAt: string;
  content: string; // can contain mentions like @username
};

export type ActivityAction = 
  | 'created' 
  | 'updated_status' 
  | 'assigned' 
  | 'commented' 
  | 'changed_date' 
  | 'moved_stage';

export type ActivityLog = {
  id: string;
  userId: string;
  taskId?: string;
  projectId?: string;
  timestamp: string;
  action: ActivityAction;
  details: string;
  oldValue?: string;
  newValue?: string;
};

export type Task = {
  id: string;
  visibleId: string;
  title: string;
  description: string;
  projectId: string;
  stageId: string;
  assigneeId?: string;
  participantIds: string[];
  priority: TaskPriority;
  startDate?: string;
  dueDate?: string;
  tags: string[];
  subtasks: Subtask[];
  comments: Comment[];
  activities: ActivityLog[];
};

export type NotificationType = 
  | 'assigned' 
  | 'mentioned' 
  | 'status_changed' 
  | 'date_changed' 
  | 'nearing_due' 
  | 'overdue'
  | 'commented';

export type Notification = {
  id: string;
  userId: string;
  actorId: string; // who triggered it
  type: NotificationType;
  taskId?: string;
  projectId?: string;
  message: string;
  createdAt: string;
  read: boolean;
};
