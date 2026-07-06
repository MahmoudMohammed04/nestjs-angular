# Chat App Backend

A backend API built with **NestJS**, **Prisma**, **PostgreSQL**, and **Firebase** for authentication and messaging.

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL
- Firebase Service Account Key

---

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
DATABASE_URL="your_postgresql_connection_string"

# Other environment variables...

# Firebase
# Make sure your Firebase service account JSON file is configured correctly.
```

Update the `DATABASE_URL` with your PostgreSQL connection string.

Place your Firebase service account JSON file (for example `chat-app-keys.json`) in the location expected by the application, or update the configuration to point to its path.

---

## Database Setup

Run the Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

---

## Running the Application

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run start:prod
```

---

## Available Scripts

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production
npm run start:prod

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## Tech Stack

- NestJS
- Prisma ORM
- PostgreSQL
- Firebase Admin SDK
- TypeScript

---

## Notes

- Update the `DATABASE_URL` inside the `.env` file before running the project.
- Configure your Firebase service account before starting the server.
- After changing the Prisma schema, run:

```bash
npx prisma migrate dev
npx prisma generate
```

---

## License

MIT
