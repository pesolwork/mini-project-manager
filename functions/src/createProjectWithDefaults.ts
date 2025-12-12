import { Timestamp } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

export const createProjectWithDefaults = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be logged in.");
  }

  const { title, description } = request.data;

  if (!title) {
    throw new HttpsError("invalid-argument", "title is required.");
  }

  const now = Timestamp.now();

  const db = admin.firestore();
  const batch = db.batch();

  const projectRef = db.collection("projects").doc();
  const tasksRef = projectRef.collection("tasks");

  // Create Project
  batch.set(projectRef, {
    ownerId: uid,
    title,
    description: description || "",
    createdAt: now,
    updatedAt: now,
  });

  // Two default tasks
  const defaultTasks = [
    { title: "Initial Setup", status: "open" },
    { title: "Review Requirements", status: "open" },
  ];

  defaultTasks.forEach((task) => {
    const taskDoc = tasksRef.doc();
    batch.set(taskDoc, {
      ...task,
      createdAt: now,
    });
  });

  await batch.commit();

  logger.info("Created project with ID:", projectRef.id);
  return { projectId: projectRef.id };
});
