import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/services/firebase";
import type { User } from "@/types";

const currentUser = ref<User | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

export const useAuth = () => {
  const isAuthenticated = computed(() => currentUser.value !== null);

  const register = async (email: string, password: string) => {
    try {
      error.value = null;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        error.value = "Email already in use";
      } else {
        error.value = err.message || "Registration failed";
      }
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      error.value = null;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (err: any) {
      const errorCodeKeys: Record<string, boolean> = {
        "auth/wrong-password": true,
        "auth/user-not-found": true,
        "auth/invalid-email": true,
        "auth/invalid-credential": true,
      };
      if (errorCodeKeys[err.code]) {
        error.value = "Invalid email or password";
      } else {
        error.value = err.message || "Login failed";
      }
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      error.value = null;
      const userCredential = await signInWithPopup(auth, googleProvider);
      return userCredential.user;
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        return;
      }

      error.value = err.message || "Login failed";
      throw err;
    }
  };

  const logout = async () => {
    try {
      error.value = null;
      await signOut(auth);
      currentUser.value = null;
    } catch (err: any) {
      error.value = err.message || "Logout failed";
      throw err;
    }
  };

  const initAuth = () => {
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, (user: FirebaseUser | null) => {
        if (user) {
          currentUser.value = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          };
        } else {
          currentUser.value = null;
        }
        loading.value = false;
        resolve();
      });
    });
  };

  return {
    currentUser,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    loginWithGoogle,
    logout,
    initAuth,
  };
};
