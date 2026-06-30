# Ionic & Vue.js

A minimal reference implementation of a mobile/web application built with **Ionic Framework** and **Vue.js**, featuring a component-based architecture, routing with Vue Router, and HTTP integration via Axios.

> [!IMPORTANT]
> **Disclaimer:** This is example code meant for learning and reference purposes. For production use, implement proper security measures, error handling, and environment-specific configurations as needed.

---

## Environment Variables

Rename the `.env.example` file in the root directory to `.env.development` or `.env.production` and populate it with the variables for your environment.

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_LOGIN_URL=https://dummyjson.com/auth/login
```

---

## Useful things

### Form Validation
`src/views/FormPage.vue`

Example of form using VeeValidate and Zod for validations, and the ApiService for HTTP requests.

### Login Page
`src/views/LoginPage.vue`

Example of login form using VeeValidate and Zod for form validations, the ApiService for HTTP requests, and Pinia for state management. Uses `dummyjson` as a test endpoint — update `VITE_LOGIN_URL` in your `.env` file for your own backend. Credentials are persisted via `capacitor-secure-storage-plugin`: on web it falls back to `localStorage`, while on iOS/Android it uses the native Keychain/Keystore.

### Listing Data
`src/views/ListPage.vue`

Example of listing data using an API service. It shows how to use infinite scroll and pagination to load data. It also shows how to use skeleton screen to display loading state.

### Middleware
`src/middlewares/guards.ts`

Example of middleware using Pinia for state management to protect routes. It redirects unauthenticated users to the login page and prevents authenticated users from accessing `/login`.

---

## Getting Started

Clone the repository, install the dependencies, and fire up the local development server using your preferred package manager:

```bash
# Install dependencies
npm install # or yarn, pnpm, bun

# Start the development server
ionic serve
```

---

ricardo albrecht - ricardoalbrecht1@gmail.com
