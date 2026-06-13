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

Example of form using vee-validate and zod for validations, axios for http requests.

### Login Page
`src/views/LoginPage.vue`

Example of login form using vee-validate and zod for form validations, axios for http requests, and pinia for state management. Using `dummyjson` as example to test form submission. Change your login url on your `.env` file to test it with your backend. Using `capacitor-secure-storage-plugin` to store token and user data. In browser it uses `localStorage` to store data and in real iOS/Android devices it uses native Keychain/Keystore to securely store data. Keep in mind that SecureStorage is not available in the web.

### Listing Data
`src/views/ListPage.vue`

Example of listing data using an API service. It shows how to use infinite scroll and pagination to load data. It also shows how to use skeleton screen to display loading state.

### Middleware
`src/middlewares/guards.ts`

Example of middleware using pinia for state management and axios for http requests. It shows how to use middleware to protect routes and redirect users to the login page if they are not authenticated. You can change it as you wish. The goal is just to show how to use middleware in vue router.

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

```bash
ricardo albrecht - ricardoalbrecht1@gmail.com
```
