# CRM Microservices

This branch currently contains two Node.js microservices:

- `services/auth-service` - signup, login, refresh token, logout, change password
- `services/user-service` - user CRUD APIs

## Local Setup

Create a local `.env.prod` or `.env.dev` from `.env.example` and fill real values.

Required values:

```env
MONGO_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ALGO=HS256
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

Install dependencies:

```bash
npm install
```

Run auth service:

```bash
npm run dev:auth
```

Run user service:

```bash
npm run dev:user
```

## Health Checks

Auth:

```text
GET http://localhost:4001/health
GET http://localhost:4001/ready
```

User:

```text
GET http://localhost:4002/health
GET http://localhost:4002/ready
```

## Production Notes

- Do not commit real `.env` files.
- Store production secrets in AWS Secrets Manager or SSM Parameter Store.
- Use `npm run start:auth` and `npm run start:user` for production-style startup.
- `/ready` should be used by ALB/ECS/ASG style readiness checks because it validates database connectivity.
