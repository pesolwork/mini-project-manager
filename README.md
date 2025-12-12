# Mini Project Manager

A small-scale project management application built using **Vite**, **Vue.js**, **Vuetify**, and **Firebase**.

---

## 🌐 Live Demo

URL: https://mini-project-manager-c6c81.web.app/

---

## 📌 Prerequisites

Before you begin, ensure you have:

- **Node.js** (LTS v18+ recommended)
- **Firebase CLI**

Install Firebase CLI:

```bash
npm install -g firebase-tools
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd mini-project-manager
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Cloud Functions Dependencies

```bash
cd functions
npm install
cd ..
```

---

## 🔥 Firebase Setup & Environment

### 1. Create a Firebase Project

- Go to **Firebase Console**
- Register a **Web App**
- Copy your `firebaseConfig` values

### 2. Setup Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
VITE_FIREBASE_API_KEY="<your-api-key>"
VITE_FIREBASE_AUTH_DOMAIN="<your-auth-domain>"
VITE_FIREBASE_PROJECT_ID="<your-project-id>"
VITE_FIREBASE_STORAGE_BUCKET="<your-storage-bucket>"
VITE_FIREBASE_MESSAGING_SENDER_ID="<your-messaging-sender-id>"
VITE_FIREBASE_APP_ID="<your-app-id>"

VITE_USE_EMULATORS=true "true or any value"
VITE_FIREBASE_REGION=us-central1
```

### 3. Connect Firebase CLI

```bash
firebase login
firebase use --add
```

---

## ⚙️ Firebase Initialization

Run:

```bash
firebase init
```

Select:

- Firestore
- Functions (TypeScript)
- Hosting (use `dist` as public directory)
- Emulators

Generated files include:

```
firestore.rules
firestore.indexes.json
functions/
firebase.json
.firebaserc
```

---

## 🧪 Firebase Emulator

### Build Functions

```bash
cd functions
npm run build
cd ..
```

### Start All Emulators

```bash
firebase emulators:start
```

Emulator UI: `http://localhost:4000`

Run specific services:

```bash
firebase emulators:start --only firestore
firebase emulators:start --only functions
firebase emulators:start --only hosting,functions
```

---

## 💻 Run Project Locally

### Frontend

```bash
npm run dev
```

Open: `http://localhost:3000`

### Backend (Emulators)

```bash
firebase emulators:start
```

---

## 🚀 Deployment

### Deploy Everything

```bash
firebase deploy
```

### Deploy Only Hosting

```bash
npm run build
firebase deploy --only hosting
```

### Deploy Only Cloud Functions

```bash
firebase deploy --only functions
```

Deploy a specific function:

```bash
firebase deploy --only functions:createProjectWithDefaults
```

### Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

### Deploy Firestore (rules + indexes)

```bash
firebase deploy --only firestore
```

### Deploy Multiple Services

```bash
firebase deploy --only functions,hosting
```

---

## 📁 Project Structure

```bash
/                      # Main Vue.js project
.env.example           # Example .env file
firebase.json          # Firebase config
firestore.rules        # Firestore rules
firestore.indexes.json # Firestore indexes
functions/             # Cloud Functions
public/                # Static assets
src/
  assets/              # Assets files
  components/          # Reusable Vue components
  composables/         # Shared and Reusable logic (Composition API)
  layouts/             # Layouts
  pages/               # Application pages
  plugins/             # Plugins
  router/              # Vue Router setup
  services/            # Firebase services
  stores/              # Pinia stores
  styles/              # Styles files
  types/               # TypeScript Interfaces, Types
  utils/               # Utilities functions
```

---

# 🗄️ Data Model

## Projects Collection

**Path:** `projects/{projectId}`

```typescript
{
  ownerId: string,          // User UID
  title: string,            // Project name
  description?: string,     // Optional description
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Tasks Subcollection

**Path:** `projects/{projectId}/tasks/{taskId}`

```typescript
{
  title: string,
  status: "open" | "done",
  dueDate?: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 📜 NPM Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Run development server   |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

---

## 🔥 Firebase Cheat Sheet

| Action                      | Command                                    |
| --------------------------- | ------------------------------------------ |
| Login                       | `firebase login`                           |
| Select Project              | `firebase use --add`                       |
| Deploy All                  | `firebase deploy`                          |
| Deploy Hosting              | `firebase deploy --only hosting`           |
| Deploy Functions            | `firebase deploy --only functions`         |
| Firestore (rules + indexes) | `firebase deploy --only firestore`         |
| Deploy Rules                | `firebase deploy --only firestore:rules`   |
| Deploy Indexes              | `firebase deploy --only firestore:indexes` |
| Start Emulators             | `firebase emulators:start`                 |

---
