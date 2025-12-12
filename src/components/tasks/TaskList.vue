<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Tasks</span>
      <TaskForm @submit="$emit('create', $event)" />
    </v-card-title>

    <v-divider></v-divider>

    <v-list v-if="tasks.length > 0">
      <v-list-item v-for="task in tasks" :key="task.id" class="border-b">
        <template v-slot:prepend>
          <v-checkbox-btn
            :model-value="task.status === 'done'"
            @update:model-value="$emit('toggle', task.id, task.status)"
            color="primary"
          ></v-checkbox-btn>
        </template>

        <v-list-item-title
          :class="{
            'text-decoration-line-through text-grey': task.status === 'done',
          }"
        >
          {{ task.title }}
        </v-list-item-title>

        <v-list-item-subtitle v-if="task.dueDate" opacity="1">
          <v-chip
            size="small"
            :color="getDateColor(task.dueDate)"
            variant="flat"
          >
            <v-icon start size="small">mdi-calendar</v-icon>
            {{ formatDate(task.dueDate) }}
          </v-chip>
        </v-list-item-subtitle>

        <template v-slot:append>
          <div class="d-flex ga-1 align-center">
            <v-chip
              :color="task.status === 'done' ? 'success' : 'warning'"
              size="small"
              variant="flat"
            >
              {{ task.status === "done" ? "Done" : "Open" }}
            </v-chip>
            <TaskForm :task="task" @submit="$emit('update', task.id, $event)" />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="confirmDelete(task)"
            ></v-btn>
          </div>
        </template>
      </v-list-item>
    </v-list>

    <v-card-text v-else>
      <v-alert type="info"> No tasks yet. Create your first task! </v-alert>
    </v-card-text>
  </v-card>

  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title>Delete Task</v-card-title>
      <v-card-text>
        Are you sure you want to delete "{{ taskToDelete?.title }}"?
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
import TaskForm from "./TaskForm.vue";
import type { Task, TaskInput } from "@/types";
import { formatDate } from "@/utils";
import type { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

interface Props {
  tasks: Task[];
}

defineProps<Props>();

const emit = defineEmits<{
  create: [data: TaskInput];
  update: [id: string, data: TaskInput];
  toggle: [id: string, currentStatus: "open" | "done"];
  delete: [id: string];
}>();

const deleteDialog = ref(false);
const taskToDelete = ref<Task | null>(null);

const getDateColor = (timestamp: Timestamp | null | undefined): string => {
  if (!timestamp) return "grey";

  const dueDate = dayjs(timestamp.toDate());

  const today = dayjs();
  const diffDays = dueDate.diff(today, "day");

  if (diffDays < 0) return "error";

  if (diffDays <= 3) return "warning";

  return "info";
};

const confirmDelete = (task: Task) => {
  taskToDelete.value = task;
  deleteDialog.value = true;
};

const handleDelete = () => {
  if (taskToDelete.value) {
    emit("delete", taskToDelete.value.id);
    deleteDialog.value = false;
    taskToDelete.value = null;
  }
};
</script>
