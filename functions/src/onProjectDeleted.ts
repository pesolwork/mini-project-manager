import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

export const onProjectDeleted = onDocumentDeleted(
  "projects/{projectId}",
  async (event) => {
    const projectId = event.params.projectId;

    const db = admin.firestore();
    const tasksSnap = await db
      .collection(`projects`)
      .doc(projectId)
      .collection("tasks")
      .get();

    const batch = db.batch();
    tasksSnap.docs.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();
  }
);
