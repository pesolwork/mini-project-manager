import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { createProjectWithDefaults } from "@/services/functions";
import type { Project, ProjectInput } from "@/types";

export const useProjects = (userId: string) => {
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const subscribeToProjects = () => {
    try {
      loading.value = true;
      error.value = null;

      const q = query(
        collection(db, "projects"),
        where("ownerId", "==", userId),
        orderBy("createdAt", "desc")
      );

      // Real-time listener with onSnapshot
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          projects.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Project[];
          loading.value = false; // Only set false after initial load
        },
        (err: any) => {
          error.value = err.message || "Failed to subscribe to projects";
          console.error("Error subscribing to projects:", err);
          loading.value = false;
        }
      );

      return unsubscribe; // Return the unsubscribe function for cleanup
    } catch (err: any) {
      error.value = err.message || "Failed to subscribe to projects";
      console.error("Error setting up subscription:", err);
      loading.value = false;
      return () => {}; // Return a no-op if setup fails
    }
  };

  const fetchProjects = async () => {
    try {
      loading.value = true;
      error.value = null;

      const q = query(
        collection(db, "projects"),
        where("ownerId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      projects.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
    } catch (err: any) {
      error.value = err.message || "Failed to fetch projects";
      console.error("Error fetching projects:", err);
    } finally {
      loading.value = false;
    }
  };

  const getProject = async (projectId: string): Promise<Project | null> => {
    try {
      const docRef = doc(db, "projects", projectId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Project;
      }
      return null;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch project";
      console.error("Error fetching project:", err);
      return null;
    }
  };

  const createProject = async (data: ProjectInput) => {
    try {
      loading.value = true;
      error.value = null;

      // Use Cloud Function to create project with default tasks
      const result = await createProjectWithDefaults(data);
      return result.projectId;
    } catch (err: any) {
      error.value = err.message || "Failed to create project";
      console.error("Error creating project:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateProject = async (
    projectId: string,
    data: Partial<ProjectInput>
  ) => {
    try {
      loading.value = true;
      error.value = null;

      const docRef = doc(db, "projects", projectId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err: any) {
      error.value = err.message || "Failed to update project";
      console.error("Error updating project:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      loading.value = true;
      error.value = null;

      const docRef = doc(db, "projects", projectId);
      await deleteDoc(docRef);
      // Cloud Function will handle deleting tasks
    } catch (err: any) {
      error.value = err.message || "Failed to delete project";
      console.error("Error deleting project:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    subscribeToProjects,
  };
};
