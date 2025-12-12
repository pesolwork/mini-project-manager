<template>
  <v-dialog v-model="dialog" max-width="600">
    <template v-slot:activator="{ props }">
      <v-btn
        v-if="!task"
        color="primary"
        v-bind="props"
        prepend-icon="mdi-plus"
      >
        New Task
      </v-btn>
      <v-btn
        v-else
        icon="mdi-pencil"
        size="small"
        variant="text"
        v-bind="props"
      ></v-btn>
    </template>

    <v-card>
      <v-card-title>
        {{ task ? "Edit Task" : "Create New Task" }}
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit" ref="formRef">
          <v-text-field
            v-model="formData.title"
            label="Task Title"
            :rules="titleRules"
            required
            autofocus
          ></v-text-field>

          <v-select
            v-model="formData.status"
            label="Status"
            :items="statusOptions"
            :rules="statusRules"
            required
          ></v-select>
          <v-date-input
            prepend-icon=""
            v-model="formData.dueDate"
            label="Due Date (optional)"
            :display-format="(date) => formatDate(date as any)"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="handleSubmit" :loading="loading">
          {{ task ? "Update" : "Create" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Task, TaskInput } from "@/types";
import { formatDate } from "@/utils";

interface Props {
  task?: Task | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  submit: [data: TaskInput];
}>();

const dialog = ref(false);
const loading = ref(false);
const formRef = ref();

const formData = ref<TaskInput>({
  title: "",
  status: "open",
  dueDate: null,
});

const statusOptions = [
  { title: "Open", value: "open" },
  { title: "Done", value: "done" },
];

const titleRules = [
  (v: string) => !!v || "Title is required",
  (v: string) => v.length >= 3 || "Title must be at least 3 characters",
];

const statusRules = [(v: string) => !!v || "Status is required"];

watch(dialog, (newValue) => {
  if (newValue && props.task) {
    formData.value = {
      title: props.task.title,
      status: props.task.status,
      dueDate: props.task.dueDate ? props.task.dueDate.toDate() : null,
    };
  } else if (newValue) {
    formData.value = {
      title: "",
      status: "open",
      dueDate: null,
    };
  }
});

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    loading.value = true;
    const submitData: TaskInput = {
      ...formData.value,
    };

    emit("submit", submitData);
    dialog.value = false;
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    loading.value = false;
  }
};
</script>
