import { httpsCallable } from "firebase/functions";
import { functions, auth } from "./firebase";
import type {
  CreateProjectResponse,
  StatsResponse,
  ProjectInput,
} from "@/types";

export const createProjectWithDefaults = async (
  data: ProjectInput
): Promise<CreateProjectResponse> => {
  const callable = httpsCallable<ProjectInput, CreateProjectResponse>(
    functions,
    "createProjectWithDefaults"
  );
  const result = await callable(data);
  return result.data;
};

export const getStats = async (): Promise<StatsResponse> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const region = import.meta.env.VITE_FIREBASE_REGION || "us-central1";

  const url =
    import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === "true"
      ? `http://localhost:5001/${projectId}/${region}/stats`
      : `https://${region}-${projectId}.cloudfunctions.net/stats`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return response.json();
};
