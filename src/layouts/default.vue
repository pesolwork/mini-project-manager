<template>
  <v-layout class="rounded rounded-md border">
    <!-- NAV DRAWER -->
    <v-navigation-drawer v-if="isAuthenticated" v-model="drawer">
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/1.jpg"
          :title="currentUser?.displayName || ''"
          :subtitle="currentUser?.email || ''"
        />
      </v-list>

      <v-divider />

      <v-list>
        <v-list-item
          v-for="item in menu"
          :key="item.title"
          :to="item.to"
          link
          :prepend-icon="item.icon"
          :title="item.title"
        />
      </v-list>

      <template v-slot:append>
        <v-list>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            @click="handleLogout"
          ></v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- APP BAR -->
    <v-app-bar v-if="isAuthenticated" color="primary" prominent>
      <!-- Drawer Toggle Button -->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title>Mini Project Manager</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-progress-linear
        v-if="authLoading"
        indeterminate
        color="primary"
      ></v-progress-linear>

      <router-view v-else />
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const {
  currentUser,
  loading: authLoading,
  isAuthenticated,
  logout,
} = useAuth();

const drawer = ref(false);

const menu = [
  { title: "Home", icon: "mdi-view-dashboard", to: "/" },
  { title: "Projects", icon: "mdi-folder", to: "/projects" },
];

const handleLogout = async () => {
  try {
    await logout();
    router.push({ path: "/login" });
  } catch (error) {
    console.error("Logout error:", error);
  }
};
</script>
