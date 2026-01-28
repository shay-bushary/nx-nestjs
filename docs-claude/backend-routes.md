# Backend Routes — nx-nest

Global prefix: `/api`

## Auth (`/api/auth`)
- `POST /api/auth/register` — register new user (body: `RegisterRequest`) returns `{ user, tokens }`
- `POST /api/auth/login` — login (body: `LoginRequest`) returns `{ user, tokens }`
- `POST /api/auth/refresh` — refresh access token (body: `{ refreshToken }`) returns `{ accessToken }`

## Users (`/api/users`)
- `GET /api/users/me` — get current user (requires JWT Bearer token) returns `User`

## App
- `GET /api` — health/hello endpoint
