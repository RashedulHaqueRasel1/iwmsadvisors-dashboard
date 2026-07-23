# 🚀 Dashboard Template

A fully-featured **Next.js 16 dashboard template** with authentication, API integration, reusable components, Tailwind CSS, ShadCN UI, charts, and more. Ready to clone and use for your projects.

---

## ⚡ Features

- ✅ Authentication with **NextAuth.js**
- ✅ Pre-built **dashboard pages** & **forms**
- ✅ Reusable components with **ShadCN UI** & **Radix UI**
- ✅ API integration ready using **Axios**
- ✅ Tailwind CSS for responsive design
- ✅ **React Hook Form** + **Zod** validation
- ✅ Charts with **Recharts**
- ✅ Real-time updates using **Socket.io client**
- ✅ Toast notifications with **Sonner**
- ✅ Middleware for route protection

---

## 🛠 Tech Stack

- **Frontend:** [Next.js 16.0.7](https://nextjs.org/)
- **UI/Components:** ShadCN UI, Radix UI, Lucide React icons
- **State Management:** React Query
- **Forms & Validation:** React Hook Form, Zod
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Notifications:** Sonner
- **Real-time:** Socket.io client
- **Linting & Formatting:** ESLint, Prettier
- **Git Hooks:** Husky, lint-staged

---

## ⚙️ Installation

### Run Locally from ZIP Download

1. Download the project ZIP file from GitHub.
2. Extract the ZIP file.
3. Open the extracted folder in your code editor.
4. Open a terminal in the project folder.
5. Install dependencies:

```bash
npm install
```

6. Create an `.env.local` file in the project root.

### ⚠️ Note

The project uses a `.env` file to manage environment variables.

If `.env.local` does not exist, create it manually and add your local values.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
```

### Environment Variables

| Variable              | What it is used for                         | Example value                  |
| --------------------- | ------------------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_URL` | Backend API base URL                        | `http://localhost:5000/api/v1` |
| `NEXTAUTH_SECRET`     | NextAuth token/session secret               | `your_random_secret`           |
| `NEXTAUTH_URL`        | Base URL of the dashboard app               | `http://localhost:3000`        |

### How Authentication Works

- `NextAuth.js` is used for authentication.
- Route protection is handled in `src/middleware.ts`.
- If the user is not logged in, protected pages redirect to `/login`.
- Auth-related public routes include login, forgot password, reset password, and OTP verification.

### Run Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Production Commands

```bash
npm run build
npm run start
```

### What Is Used Where

- `Next.js 16` is used for routing and application structure.
- `React 19` is used to build dashboard UI components.
- `NextAuth.js` is used for login/session handling.
- `TanStack React Query` is used for server-state fetching and caching.
- `Axios` is used for API calls.
- `React Hook Form` and `Zod` are used for forms and validation.
- `Recharts` is used for charts and dashboard analytics widgets.
- `Socket.io client` is used for real-time features where needed.
- `ShadCN UI` and `Radix UI` are used for reusable UI components.
- `Sonner` is used for toast notifications.
- `Husky` and `lint-staged` are used for Git hooks and code quality checks.

### Main Folder Guide

- `src/app/` contains the app routes and pages.
- `src/components/` contains reusable dashboard components.
- `src/lib/` contains utilities and shared logic.
- `src/middleware.ts` handles route protection logic.
- `public/images/` contains static dashboard assets.

--
