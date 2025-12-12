import { Timestamp } from "firebase/firestore";

export interface TimestampLike {
  seconds: number;
  nanoseconds: number;
}

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

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export interface CreateProjectResponse {
  projectId: string;
}

export interface StatsResponse {
  projectCount: number;
  taskCount: number;
}
