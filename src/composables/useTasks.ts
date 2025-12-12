import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import type { Task, TaskInput } from "@/types";
import { useAuth } from "./useAuth";

export const useTasks = (projectId: string) => {
  const { currentUser } = useAuth();

  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const subscribeToTasks = () => {
    try {
      loading.value = true;
      error.value = null;

      const q = query(
        collection(db, "projects", projectId, "tasks"),
        orderBy("createdAt", "desc")
      );

      // Real-time listener with onSnapshot
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          tasks.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Task[];
          loading.value = false; // Only set false after initial load
        },
        (err: any) => {
          error.value = err.message || "Failed to subscribe to tasks";
          console.error("Error subscribing to tasks:", err);
          loading.value = false;
        }
      );

      return unsubscribe; // Return the unsubscribe function for cleanup
    } catch (err: any) {
      error.value = err.message || "Failed to subscribe to tasks";
      console.error("Error setting up subscription:", err);
      loading.value = false;
      return () => {}; // Return a no-op if setup fails
    }
  };

  const fetchTasks = async () => {
    try {
      loading.value = true;
      error.value = null;

      const q = query(
        collection(db, "projects", projectId, "tasks"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      tasks.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
    } catch (err: any) {
      error.value = err.message || "Failed to fetch tasks";
      console.error("Error fetching tasks:", err);
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (data: TaskInput) => {
    try {
      loading.value = true;
      error.value = null;

      const taskData = {
        title: data.title,
        status: data.status,
        dueDate: data.dueDate ? Timestamp.fromDate(data.dueDate) : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "projects", projectId, "tasks"), taskData);
    } catch (err: any) {
      error.value = err.message || "Failed to create task";
      console.error("Error creating task:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateTask = async (taskId: string, data: Partial<TaskInput>) => {
    try {
      loading.value = true;
      error.value = null;

      const docRef = doc(db, "projects", projectId, "tasks", taskId);
      const updateData: any = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      if (data.dueDate !== undefined) {
        updateData.dueDate = data.dueDate
          ? Timestamp.fromDate(data.dueDate)
          : null;
      }

      await updateDoc(docRef, updateData);
    } catch (err: any) {
      error.value = err.message || "Failed to update task";
      console.error("Error updating task:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const toggleTaskStatus = async (
    taskId: string,
    currentStatus: "open" | "done"
  ) => {
    const newStatus = currentStatus === "open" ? "done" : "open";
    await updateTask(taskId, { status: newStatus });
  };

  const deleteTask = async (taskId: string) => {
    try {
      loading.value = true;
      error.value = null;

      const docRef = doc(db, "projects", projectId, "tasks", taskId);
      await deleteDoc(docRef);
    } catch (err: any) {
      error.value = err.message || "Failed to delete task";
      console.error("Error deleting task:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    subscribeToTasks,
  };
};
