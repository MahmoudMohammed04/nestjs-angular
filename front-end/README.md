# Chat App Frontend

Frontend application built with **Angular** and **Firebase Authentication**.

## Prerequisites

- Node.js 18+
- npm
- Angular CLI

---

## Installation

Install the project dependencies:

```bash
npm install
```

---

## Environment Configuration

Update the Firebase configuration inside:

```text
src/environments/environment.ts
```

Replace the placeholder values with your Firebase project configuration:

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
  },
  apiDomain: {
    domain: "http://localhost:3000",
  },
};
```

Make sure `apiDomain.domain` points to the running backend server.

---

## Running the Application

Start the development server:

```bash
ng serve
```

or

```bash
npm start
```

Open your browser at:

```
http://localhost:4200
```

The application will automatically reload whenever you make changes.

---

## Building

Create a production build:

```bash
ng build
```

The compiled files will be generated inside the `dist/` directory.

---

## Running Tests

Run unit tests:

```bash
ng test
```

Run end-to-end tests (if configured):

```bash
ng e2e
```

---

## Tech Stack

- Angular
- TypeScript
- Angular Material
- Firebase Authentication
- RxJS

---

## Notes

- Replace all placeholder Firebase values in `src/environments/environment.ts`.
- Ensure the backend API is running before starting the frontend.
- Update `apiDomain.domain` if your backend is hosted on a different URL.

---

## License

MIT
