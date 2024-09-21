# Task Management Web Application

Application to manage your daily tasks.
Frontend and backend all are deployed.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `backend`: a [Node.js](https://nodejs.org/en) app
- `web`: a [Next.js](https://nextjs.org/) app
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

## Install and Run Backend

To install all packages and start backend, run the following command:

```
cd task-management-site/apps/backend
```
```
npm install
```
```
tsc
```
```
node dist/index.js
```

### .env setup

```
PORT = 5000
CONNECTION_STRING='' // mongo connection string
DB_NAME='tasks'
SECRET='' // secret for JWT
```

## Install and Run Next Frontend

To install all the packages and start frontend, run the following command:

```
cd task-management-site/apps/web
```
```
npm install
```
```
npm run dev
```

## Deployment

services used to deploy frontend and backend

- Frontend: [Vercel](https://vercel.com/)
- Backend: [Render](https://render.com/)
- Database: [MongoDB Compass](https://www.mongodb.com/)



## 🙏 Thank you so much for the opportunity.
