# Student Management System

A fast Student Management System built with React, Vite, Tailwind CSS, React Router, Firebase Auth, and Cloud Firestore.

## Features

- Admin, teacher, and student login
- Student signup / create account
- Role-based protected routes
- Student CRUD with search and detail view
- Attendance tracking by date
- Results management with grade calculation
- Teacher account creation from the admin page
- Separate student and teacher dashboards
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
4. Paste the Firebase web app credentials into `.env`.
5. You can either create accounts manually in Firebase Auth or use the in-app flows:
   - Use the login page button to create the default admin `admin@gmail.com / admin123`
   - Use the admin page to create teacher accounts
   - Use the student signup form to create student accounts

## 4. Run locally

```bash
npm run dev
```

## 5. Build for production

```bash
npm run build
```

## Firestore collections used

- `users`
- `students`
- `teachers`
- `attendance`
- `results`

## Suggested Firestore rules for MVP

These are intentionally simple starter rules. For real production role security, update them to enforce
role-based access using the `users` collection:

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

## Default Admin

The app includes a bootstrap flow for this default admin account:

- Email: `admin@gmail.com`
- Password: `admin123`

Open the login page and use the **Create Default Admin** button once for your Firebase project.

## Role Flows

- Admin: login, manage students, attendance, results, and create teacher accounts
- Teacher: login and access the teacher dashboard plus student, attendance, and results modules
- Student: sign up, log in, and access a separate student dashboard with personal attendance and result data

## Deploying to Vercel

1. Import the repository into Vercel.
2. Add the same `VITE_FIREBASE_*` variables in the Vercel project settings.
3. Deploy.

The included `vercel.json` handles client-side routing for React Router.
