import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

export const onProjectDeleted = onDocumentDeleted(
  "projects/{projectId}",
  async (event): Promise<void> => {
    const projectId = event.params.projectId;

    const db = admin.firestore();
    const tasksSnap = await db
      .collection(`projects`)
      .doc(projectId)
      .collection("tasks")
      .get();

    if (tasksSnap.empty) {
      logger.log(`No tasks found for project ID: ${projectId}`);
      return;
    }

    const batch = db.batch();
    tasksSnap.docs.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();

    logger.log(`Deleted all tasks for project ID: ${projectId}`);
  }
);
