# ARIE JEWELRY & ACCESSORIES – SECURITY ARCHITECTURE & AUDIT GUIDE

## 1. Executive Summary & Protections Implemented

This document details the security controls, authentication mechanisms, session management policies, and database safeguards implemented for the **Arie Jewelry and Accessories** production e-commerce store and administrator atelier.

---

### A. Authentication & Credential Storage
- **Password Hashing**: Passwords are hashed using **Bcrypt with a work factor of 12** (`BCRYPT_ROUNDS = 12`). Plaintext passwords are never logged, stored in cache, or returned in API responses.
- **Constant-Time Verification**: When verifying credentials, invalid usernames undergo a simulated cryptographic hash comparison to prevent timing-based username enumeration.
- **Generic Error Responses**: Failed login attempts return a uniform `"Invalid username or password."` message to eliminate reconnaissance vectors.
- **Password Policy**: Password modifications require verification of the existing password and enforce at least 10 characters with mandatory uppercase, lowercase, and numeric digits.

### B. Brute-Force Defense & Rate Limiting
- **Lockout Mechanism**: IP and username combination requests are tracked in a 15-minute rolling window (`RATE_LIMIT_WINDOW_MINUTES = 15`).
- **Threshold**: Exceeding 5 consecutive failed attempts triggers an immediate temporary account and IP lockout for 15 minutes, returning HTTP `429 Too Many Requests`.
- **Lockout Timer**: Responses include the exact remaining lockout seconds. All lockout events are logged to the security audit trail.

### C. Session Management
- **Cookies**: Sessions are stored in signed cookies (`arie_admin_session`) configured with:
  - `HttpOnly`: Prevents client-side script access, defending against XSS token extraction.
  - `SameSite=Strict`: Protects against Cross-Site Request Forgery (CSRF).
  - `Secure`: Transmitted strictly over encrypted TLS connections in production.
- **Timeouts**:
  - **Idle Timeout**: 30 minutes of inactivity invalidates the session cookie.
  - **Absolute Timeout**: Maximum 12 hours from initial authentication, after which re-authentication is mandatory.

### D. Server-Side Protection & Authorization
- **Middleware Guard**: All `/admin/*` views and `/api/admin/*` endpoints pass through `requireAdminAuth`. Unauthenticated API calls receive HTTP `401 Unauthorized`; unauthenticated page requests redirect to `/admin/login`.
- **Zero Client Trust for Pricing**:
  - Public endpoints cannot execute write operations on products or inventory.
  - The cart and checkout flows invoke `/api/cart/verify` and `/api/checkout`, which discard any prices or discounts sent from the client and recalculate the entire order from the database.
  - Currency is stored as integer **kobo** (e.g. ₦48,500 = `4850000` kobo) to avoid floating-point rounding errors.
  - **Timed Promotions**: Discount windows are evaluated on the server in UTC (`discount.startDate` and `discount.endDate`), and displayed in `Africa/Lagos` (WAT, UTC+1). Expired discounts automatically revert to base price.

### E. Image Upload Security
- **Strict Size Constraint**: Maximum 5MB per file (`MAX_FILE_SIZE = 5 * 1024 * 1024`).
- **Magic Bytes Validation**: File headers are inspected in memory for true image signatures:
  - JPEG: `FF D8 FF`
  - PNG: `89 50 4E 47 0D 0A 1A 0A`
  - WebP: `RIFF` and `WEBP` magic bytes
  - Any binary with altered extension or non-image payload is rejected immediately.
- **Filename Randomization**: Uploaded files receive cryptographic UUID names (`crypto.randomUUID()`) to prevent directory traversal attacks or filename collisions.
- **Supabase Storage**: Uploads target the Supabase `products` storage bucket with local fallback.

### F. Security Headers & Search Engine Cloaking
- **HTTP Headers Configured**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (Production)
- **Crawler Disallowance**:
  - `/robots.txt` disallows `/admin` and `/api/admin`.
  - Admin endpoints inject the HTTP header `X-Robots-Tag: noindex, nofollow`.
  - Admin pages dynamically inject `<meta name="robots" content="noindex, nofollow" />`.

### G. Security Audit Trail
- Every administrative action is immutably logged with:
  - Action identifier (`LOGIN_SUCCESS`, `LOGIN_FAILED_BAD_PASSWORD`, `LOGIN_BLOCKED_LOCKOUT`, `PRODUCT_CREATED`, `PRODUCT_UPDATED`, `PRODUCT_DELETED`, `ORDER_STATUS_CHANGED`, `PASSWORD_CHANGED`)
  - Admin username
  - Client IP address
  - Event details and timestamp
- Viewable directly inside the Admin Atelier Settings interface.

---

## 2. Pre-Launch Security Checklist

Before transitioning the store to production:

- [ ] **Rotate Default Secrets**:
  - Generate a new 64-character random string for `SESSION_SECRET` in `.env`:
    ```bash
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```
- [ ] **Change Initial Admin Password**:
  - Log into `/admin/login` using the initial credentials (`declareola` / `arieb26a-a13fde053ca9?`).
  - Navigate to **Settings** and update the password to a personal, high-entropy passphrase.
- [ ] **Supabase Storage Bucket Configuration**:
  - Ensure the `products` bucket exists in your Supabase project (`https://ognbnevkisyvlpedyqwd.supabase.co`).
  - Set bucket visibility to **Public** for image delivery.
  - Enable Row Level Security (RLS) policies allowing public read and restricting write access to authenticated admin service role.
- [ ] **HTTPS Enforced**:
  - Verify that the production domain enforces TLS 1.3 / HTTPS redirection.
- [ ] **Automated Database Backups**:
  - Enable automated daily snapshots in the Supabase database settings.
- [ ] **Run Security Test Suite**:
  - Confirm all security regression tests pass:
    ```bash
    npm test
    ```

---

## 3. Deployment Instructions

### A. Deploying on Vercel
1. Push your repository to GitHub or GitLab.
2. In the Vercel Dashboard, select **Add New Project** and import the repository.
3. Configure the **Environment Variables** under Project Settings:
   - `SUPABASE_URL`: `https://ognbnevkisyvlpedyqwd.supabase.co`
   - `SUPABASE_ANON_KEY`: `sb_publishable_49TfL4k1cyG9rsMdQJo42g_muJ2OIA7`
   - `SESSION_SECRET`: `<YOUR_GENERATED_SESSION_SECRET>`
   - `ADMIN_INITIAL_USERNAME`: `declareola`
   - `ADMIN_INITIAL_PASSWORD`: `<YOUR_ADMIN_PASSWORD>`
   - `NODE_ENV`: `production`
4. Deploy the project. The build command will execute `npm run build` and output static assets to `dist`.

### B. Deploying on Cloud Run / Node Server / Docker
1. Ensure the port environment variable is set (`PORT=3000`).
2. Run the seed script:
   ```bash
   npm run seed
   ```
3. Build the frontend client:
   ```bash
   npm run build
   ```
4. Start the full-stack server:
   ```bash
   npm start
   ```
5. The server will listen on port 3000, serving API endpoints, image uploads, and client SPA pages.
