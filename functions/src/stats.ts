import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

export const stats = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const db = admin.firestore();
    const projectsSnap = await db
      .collection("projects")
      .where("ownerId", "==", uid)
      .get();

    const projectIds = projectsSnap.docs.map((doc) => doc.id);

    let taskCount = 0;
    for (const projectId of projectIds) {
      const tasksSnap = await db
        .collection("projects")
        .doc(projectId)
        .collection("tasks")
        .get();

      taskCount += tasksSnap.size;
    }

    res.json({
      projectCount: projectsSnap.size,
      taskCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
