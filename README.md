# Student Management System

A fast MVP Student Management System built with React, Vite, Tailwind CSS, React Router, Firebase Auth, and Cloud Firestore.

## Features

- Admin email/password login
- Protected dashboard routes
- Student CRUD with search and detail view
- Attendance tracking by date
- Results management with grade calculation
- Vercel-ready single page app routing

## 1. Install dependencies

```bash
npm install
```

## 2. Create your environment file

Copy `.env.example` to `.env` and fill in your Firebase project values:

```bash
cp .env.example .env
```

If you are on Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## 3. Firebase setup

In the Firebase console:

1. Create a web app inside your Firebase project.
2. Enable **Authentication > Sign-in method > Email/Password**.
3. Create a Firestore database.
4. Add one admin user in **Authentication > Users**.
5. Paste the Firebase web app credentials into `.env`.

## 4. Run locally

```bash
npm run dev
```

## 5. Build for production

```bash
npm run build
```

## Firestore collections used

- `students`
- `attendance`
- `results`

## Suggested Firestore rules for MVP

These are intentionally simple for a single-admin MVP:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Deploying to Vercel

1. Import the repository into Vercel.
2. Add the same `VITE_FIREBASE_*` variables in the Vercel project settings.
3. Deploy.

The included `vercel.json` handles client-side routing for React Router.
