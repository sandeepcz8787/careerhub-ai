# API Reference — CareerHub AI

## Base URL

```
Development:  http://localhost:5000/api/v1
Production:   https://api.careerhub.ai/api/v1
```

## Authentication

All protected endpoints require:
```
Authorization: Bearer <accessToken>
```

## Response Format

All responses follow the standardized envelope defined in `packages/shared/src/types/api.types.ts`.

---

## Endpoints

### Health

#### GET /health
Check API health status.

**Auth:** None  
**Rate Limit:** Exempt

**Response 200:**
```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "healthy",
    "environment": "production",
    "uptime": 12345,
    "services": {
      "database": { "status": "connected", "latencyMs": 2 }
    }
  }
}
```

---

### Auth (Coming Soon)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate refresh token |
| POST | `/auth/verify-email` | Verify email with OTP |
| POST | `/auth/resend-otp` | Resend verification OTP |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |
| GET | `/auth/google` | OAuth with Google |
| GET | `/auth/linkedin` | OAuth with LinkedIn |

---

## Error Codes

See `packages/shared/src/constants/error.constants.ts` for the full list.

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 422 | Request body failed validation |
| `AUTH_INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `AUTH_TOKEN_EXPIRED` | 401 | Access token has expired |
| `AUTH_TOKEN_INVALID` | 401 | Token is malformed or tampered |
| `AUTH_INSUFFICIENT_PERMISSIONS` | 403 | User lacks required role |
| `AUTH_EMAIL_NOT_VERIFIED` | 403 | Email not verified yet |
| `USER_NOT_FOUND` | 404 | User does not exist |
| `USER_EMAIL_TAKEN` | 409 | Email already registered |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |
