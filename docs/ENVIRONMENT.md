# Environment Variables Reference

## apps/server

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | `development` | Runtime environment |
| `PORT` | No | `5000` | HTTP server port |
| `APP_URL` | No | `http://localhost:5000` | Backend URL |
| `CLIENT_URL` | No | `http://localhost:5173` | Frontend URL |
| `ALLOWED_ORIGINS` | No | `http://localhost:5173` | Comma-separated CORS origins |
| `MONGODB_URI` | **Yes** | — | MongoDB Atlas connection string |
| `JWT_ACCESS_SECRET` | **Yes** | — | Min 32 chars. Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_REFRESH_SECRET` | **Yes** | — | Min 32 chars. Generate same as above |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Access token TTL |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token TTL |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | — | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | **Yes** | — | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | **Yes** | — | From Cloudinary dashboard |
| `SMTP_HOST` | **Yes** | `smtp.gmail.com` | Email server host |
| `SMTP_PORT` | No | `587` | Email server port |
| `SMTP_USER` | **Yes** | — | SMTP username (email) |
| `SMTP_PASSWORD` | **Yes** | — | SMTP password or app password |
| `GOOGLE_CLIENT_ID` | No | — | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | — | Google OAuth client secret |
| `COOKIE_SECRET` | **Yes** | — | Min 32 chars random string |
| `LOG_LEVEL` | No | `debug` | `error`, `warn`, `info`, `debug` |

## apps/web

> ⚠️ All VITE_* variables are exposed to the browser. Never put secrets here.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes | `http://localhost:5000/api/v1` | Backend API base URL |
| `VITE_APP_NAME` | No | `CareerHub AI` | Application display name |
| `VITE_SOCKET_URL` | No | `http://localhost:5000` | Socket.io server URL |
| `VITE_GOOGLE_CLIENT_ID` | No | — | Google OAuth (public ID only) |

## Generating Secrets

```bash
# Generate a strong JWT secret or cookie secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or using openssl
openssl rand -hex 64
```
