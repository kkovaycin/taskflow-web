export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface ITask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTask {
  title: string;
  assignee: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

// Partial updates can include any subset of editable task fields.
export type UpdateTask = Partial<ICreateTask>;
