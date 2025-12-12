<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h4">Projects</h1>
          <v-chip v-if="stats" color="primary" variant="flat">
            <v-icon start>mdi-chart-box</v-icon>
            {{ stats.projectCount }} projects, {{ stats.taskCount }} tasks
          </v-chip>
        </div>

        <ProjectList
          :projects="projects"
          :loading="loading"
          @create="handleCreate"
          @update="handleUpdate"
          @delete="handleDelete"
        />
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
import ProjectList from "@/components/projects/ProjectList.vue";
import { useAuth } from "@/composables/useAuth";
import { useProjects } from "@/composables/useProjects";
import { getStats } from "@/services/functions";
import type { ProjectInput, StatsResponse } from "@/types";

definePage({
  meta: {
    requiresAuth: true,
  },
});

const { currentUser } = useAuth();
const {
  projects,
  loading,
  createProject,
  updateProject,
  deleteProject,
  subscribeToProjects,
} = useProjects(currentUser.value!.uid);

const stats = ref<StatsResponse | null>(null);
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

const loadStats = async () => {
  try {
    stats.value = await getStats();
  } catch (error) {
    console.error("Error loading stats:", error);
  }
};

const handleCreate = async (data: ProjectInput) => {
  try {
    await createProject(data);
    showSnackbar("Project created successfully!");
    await loadStats();
  } catch (error) {
    showSnackbar("Failed to create project", "error");
  }
};

const handleUpdate = async (id: string, data: ProjectInput) => {
  try {
    await updateProject(id, data);
    showSnackbar("Project updated successfully!");
  } catch (error) {
    showSnackbar("Failed to update project", "error");
  }
};

const handleDelete = async (id: string) => {
  try {
    await deleteProject(id);
    showSnackbar("Project deleted successfully!");
    await loadStats();
  } catch (error) {
    showSnackbar("Failed to delete project", "error");
  }
};

onMounted(async () => {
  await loadStats();
});

const unsubscribe = subscribeToProjects();

onUnmounted(() => {
  unsubscribe();
});
</script>
