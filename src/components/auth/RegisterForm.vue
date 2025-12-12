<template>
  <v-card max-width="400" class="mx-auto">
    <v-card-title class="text-h5">Register</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleRegister" ref="formRef">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          :rules="emailRules"
          required
          prepend-inner-icon="mdi-email"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          :rules="passwordRules"
          required
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>

        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          :type="showConfirmPassword ? 'text' : 'password'"
          :rules="confirmPasswordRules"
          required
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
        ></v-text-field>

        <v-alert v-if="error" type="error" class="mb-4">
          {{ error }}
        </v-alert>

        <v-btn
          type="submit"
          color="primary"
          block
          :loading="loading"
          size="large"
        >
          Register
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { register, error } = useAuth();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const formRef = ref();

const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
];

const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 6 || "Password must be at least 6 characters",
];

const confirmPasswordRules = [
  (v: string) => !!v || "Please confirm your password",
  (v: string) => v === password.value || "Passwords do not match",
];

const handleRegister = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    loading.value = true;
    error.value = "";
    await register(email.value, password.value);
    router.push({ path: "/projects" });
  } finally {
    loading.value = false;
  }
};
</script>
