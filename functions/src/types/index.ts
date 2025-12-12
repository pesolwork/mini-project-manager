import { Timestamp } from "firebase-admin/firestore";

export interface Project {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProjectInput {
  title: string;
  description?: string;
}

export type TaskStatus = "open" | "done";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TaskInput {
  title: string;
  status: TaskStatus;
  dueDate?: Date | null;
}

export interface CreateProjectResponse {
  projectId: string;
}

export interface StatsResponse {
  projectCount: number;
  taskCount: number;
}
