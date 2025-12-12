<template>
  <v-card max-width="400" class="mx-auto">
    <v-card-title class="text-h5">Login</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleLogin" ref="formRef">
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

        <v-alert v-if="error" type="error" class="mb-4">
          {{ error }}
        </v-alert>

        <v-btn
          type="submit"
          color="primary"
          block
          :loading="loading"
          size="large"
          class="mb-4"
        >
          Login
        </v-btn>
        <v-btn
          type="button"
          color="secondary"
          block
          size="large"
          @click="handleLoginWithGoogle"
        >
          Login with Google
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { login, loginWithGoogle, error } = useAuth();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const formRef = ref();

const emailRules = [
  (v: string) => !!v || "Email is required",
  // (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
];

const passwordRules = [
  (v: string) => !!v || "Password is required",
  // (v: string) => v.length >= 6 || "Password must be at least 6 characters",
];

const handleLoginWithGoogle = async () => {
  try {
    error.value = "";
    await loginWithGoogle();
    router.replace({ path: "/projects" });
  } finally {
    loading.value = false;
  }
};

const handleLogin = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    loading.value = true;
    error.value = "";
    await login(email.value, password.value);
    router.replace({ path: "/projects" });
  } finally {
    loading.value = false;
  }
};
</script>
