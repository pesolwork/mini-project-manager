<template>
  <v-dialog v-model="dialog" max-width="600">
    <template v-slot:activator="{ props }">
      <v-btn
        v-if="!project"
        color="primary"
        v-bind="props"
        prepend-icon="mdi-plus"
      >
        New Project
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
        {{ project ? "Edit Project" : "Create New Project" }}
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit" ref="formRef">
          <v-text-field
            v-model="formData.title"
            label="Project Title"
            :rules="titleRules"
            required
            autofocus
          ></v-text-field>

          <v-textarea
            v-model="formData.description"
            label="Description (optional)"
            rows="3"
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="handleSubmit" :loading="loading">
          {{ project ? "Update" : "Create" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Project, ProjectInput } from "@/types";

interface Props {
  project?: Project | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  submit: [data: ProjectInput];
}>();

const dialog = ref(false);
const loading = ref(false);
const formRef = ref();

const formData = ref<ProjectInput>({
  title: "",
  description: "",
});

const titleRules = [
  (v: string) => !!v || "Title is required",
  (v: string) => v.length >= 3 || "Title must be at least 3 characters",
];

watch(dialog, (newValue) => {
  if (newValue && props.project) {
    formData.value = {
      title: props.project.title,
      description: props.project.description || "",
    };
  } else if (newValue) {
    formData.value = {
      title: "",
      description: "",
    };
  }
});

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    loading.value = true;
    emit("submit", formData.value);
    dialog.value = false;
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    loading.value = false;
  }
};
</script>
