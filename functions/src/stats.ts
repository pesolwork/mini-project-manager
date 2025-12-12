import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { StatsResponse } from "./types";

export const stats = onRequest(
  { cors: true },
  async (req, res): Promise<void> => {
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

      // Verify token
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;

      const db = admin.firestore();

      // Fetch Projects Owned by User
      const projectsSnap = await db
        .collection("projects")
        .where("ownerId", "==", uid)
        .get();

      const projectIds = projectsSnap.docs.map((doc) => doc.id);

      const taskCountPromises = projectIds.map((projectId) =>
        db
          .collection("projects")
          .doc(projectId)
          .collection("tasks")
          .count()
          .get()
      );

      const taskCountResults = await Promise.all(taskCountPromises);

      // Sum all task counts
      const taskCount = taskCountResults.reduce(
        (sum, snap) => sum + (snap.data()?.count ?? 0),
        0
      );

      const response: StatsResponse = {
        projectCount: projectsSnap.size,
        taskCount,
      };

      res.json(response);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
