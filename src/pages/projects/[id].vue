<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-btn
          @click="$router.back()"
          variant="text"
          prepend-icon="mdi-arrow-left"
          class="mb-4"
        >
          Back to Projects
        </v-btn>

        <v-card v-if="project" class="mb-6">
          <v-card-title class="text-h4">
            {{ project.title }}
          </v-card-title>
          <v-card-text>
            <p v-if="project.description" class="text-body-1 mb-4">
              {{ project.description }}
            </p>
            <div class="text-caption text-grey">
              Created At: {{ formatDate(project.createdAt) }}
            </div>
          </v-card-text>
        </v-card>

        <TaskList
          v-if="project"
          :tasks="tasks"
          @create="handleCreateTask"
          @update="handleUpdateTask"
          @toggle="handleToggleTask"
          @delete="handleDeleteTask"
        />

        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          class="mx-auto d-block mt-4"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top center"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { useProjects } from "@/composables/useProjects";
import { useTasks } from "@/composables/useTasks";
import TaskList from "@/components/tasks/TaskList.vue";
import type { Project, TaskInput } from "@/types";
import { formatDate } from "@/utils";

definePage({
  meta: {
    requiresAuth: true,
  },
});

const route = useRoute("/projects/[id]");
const router = useRouter();
const { currentUser } = useAuth();

const projectId = route.params.id as string;
const { getProject } = useProjects(currentUser.value!.uid);
const {
  tasks,
  loading,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  subscribeToTasks,
} = useTasks(projectId);

const project = ref<Project | null>(null);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const showSnackbar = (
  message: string,
  color: "success" | "error" = "success"
) => {
  snackbarText.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

const handleCreateTask = async (data: TaskInput) => {
  try {
    await createTask(data);
    showSnackbar("Task created successfully!");
  } catch (error) {
    showSnackbar("Failed to create task", "error");
  }
};

const handleUpdateTask = async (id: string, data: TaskInput) => {
  try {
    await updateTask(id, data);
    showSnackbar("Task updated successfully!");
  } catch (error) {
    showSnackbar("Failed to update task", "error");
  }
};

const handleToggleTask = async (id: string, currentStatus: "open" | "done") => {
  try {
    await toggleTaskStatus(id, currentStatus);
    const newStatus = currentStatus === "open" ? "completed" : "reopened";
    showSnackbar(`Task ${newStatus}!`);
  } catch (error) {
    showSnackbar("Failed to update task status", "error");
  }
};

const handleDeleteTask = async (id: string) => {
  try {
    await deleteTask(id);
    showSnackbar("Task deleted successfully!");
  } catch (error) {
    showSnackbar("Failed to delete task", "error");
  }
};

onMounted(async () => {
  project.value = await getProject(projectId);
  if (!project.value) {
    showSnackbar("Project not found", "error");
    router.push({ path: "/projects" });
    return;
  }
});

const unsubscribe = subscribeToTasks();

onUnmounted(() => {
  unsubscribe();
});
</script>
