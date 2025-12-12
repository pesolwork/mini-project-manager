<template>
  <v-data-table
    :headers="headers"
    :items="projects"
    :loading="loading"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>My Projects</v-toolbar-title>
        <v-spacer></v-spacer>
        <ProjectForm @submit="$emit('create', $event)" />
      </v-toolbar>
    </template>

    <template v-slot:item.title="{ item }">
      <!-- <router-link
        :to="{ name: '/projects/[id]', params: { id: item.id } }"
        class="text-decoration-none"
      > -->
      {{ item.title }}
      <!-- </router-link> -->
    </template>

    <template v-slot:item.createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>
    <template v-slot:item.updatedAt="{ item }">
      {{ formatDate(item.updatedAt) }}
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex ga-1 justify-end">
        <v-btn icon="mdi-eye" size="small" variant="text" color="primary" @click="$router.push(`/projects/${item.id}`)" />
        <ProjectForm
          :project="item"
          @submit="$emit('update', item.id, $event)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="confirmDelete(item)"
        ></v-btn>
      </div>
    </template>

    <template v-slot:no-data>
      <v-alert type="info" class="ma-4">
        No projects yet. Create your first project!
      </v-alert>
    </template>
  </v-data-table>

  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title>Delete Project</v-card-title>
      <v-card-text>
        Are you sure you want to delete "{{ projectToDelete?.title }}"? This
        will also delete all associated tasks.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="deleteDialog = false">Cancel</v-btn>
        <v-btn color="error" @click="handleDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import ProjectForm from "./ProjectForm.vue";
import type { Project, ProjectInput } from "@/types";
import { formatDate } from "@/utils";

interface Props {
  projects: Project[];
  loading: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  create: [data: ProjectInput];
  update: [id: string, data: ProjectInput];
  delete: [id: string];
}>();

const headers = [
  { title: "Title", key: "title", sortable: true },
  { title: "Description", key: "description", sortable: false },
  { title: "Created At", key: "createdAt", sortable: true },
  { title: "Updated At", key: "updatedAt", sortable: true },
  { title: "Actions", key: "actions", sortable: false, align: "end" as const },
];

const deleteDialog = ref(false);
const projectToDelete = ref<Project | null>(null);

const confirmDelete = (project: Project) => {
  projectToDelete.value = project;
  deleteDialog.value = true;
};

const handleDelete = () => {
  if (projectToDelete.value) {
    emit("delete", projectToDelete.value.id);
    deleteDialog.value = false;
    projectToDelete.value = null;
  }
};
</script>
