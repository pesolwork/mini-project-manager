<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <div class="text-center mb-8">
          <h1 class="text-h3 mb-2">Mini Project Manager</h1>
          <p class="text-subtitle-1 text-grey">
            Manage your projects and tasks
          </p>
        </div>

        <v-tabs v-model="tab" fixed-tabs class="mb-4">
          <v-tab value="login">Login</v-tab>
          <v-tab value="register">Register</v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item value="login">
            <LoginForm />
          </v-window-item>

          <v-window-item value="register">
            <RegisterForm />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import LoginForm from "@/components/auth/LoginForm.vue";
import RegisterForm from "@/components/auth/RegisterForm.vue";
import { useAuth } from "@/composables/useAuth";
import router from "@/router";

const { isAuthenticated } = useAuth();

if (isAuthenticated.value) {
  router.replace("/projects");
}

const tab = ref("login");
</script>

<route lang="yaml">
meta:
  layout: blank
</route>
