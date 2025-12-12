<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
import { useAuth } from "@/composables/useAuth";

const { initAuth } = useAuth();

onMounted(async () => {
  await initAuth();
});
</script>
