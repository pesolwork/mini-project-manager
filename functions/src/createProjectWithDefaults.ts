import { Timestamp } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import {
  CreateProjectResponse,
  Project,
  ProjectInput,
  Task,
  TaskInput,
} from "./types";

export const createProjectWithDefaults = onCall(
  async (request): Promise<CreateProjectResponse> => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "User must be logged in.");
    }

    const { title, description } = request.data as ProjectInput;

    if (!title) {
      throw new HttpsError("invalid-argument", "title is required.");
    }

    const now = Timestamp.now();

    const db = admin.firestore();
    const batch = db.batch();

    const projectRef = db.collection("projects").doc();
    const tasksRef = projectRef.collection("tasks");

    // Project data
    const projectData: Omit<Project, "id"> = {
      ownerId: uid,
      title,
      description,
      createdAt: now,
      updatedAt: now,
    };

    // Create Project
    batch.set(projectRef, projectData);

    // Two default tasks
    const defaultTasks: TaskInput[] = [
      { title: "Initial Setup", status: "open" },
      { title: "Review Requirements", status: "open" },
    ];

    defaultTasks.forEach((task) => {
      const taskDoc = tasksRef.doc();
      // Task data
      const taskData: Omit<Task, "id"> = {
        ...task,
        dueDate: null,
        createdAt: now,
        updatedAt: now,
      };
      batch.set(taskDoc, taskData);
    });

    await batch.commit();

    logger.info("Created project with ID:", projectRef.id);
    return { projectId: projectRef.id };
  }
);
