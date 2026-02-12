# Backend Schema Specification (v0.1)

**Stack:** Node.js / Express + PostgreSQL (or Supabase)  
**Purpose:** Handle authentication, store assessment responses, calculate scores

---

## Database Tables

### Table: `users`

Stores user accounts and authentication data.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Notes:**
- Passwords hashed with bcrypt before storage
- Email must be unique
- UUID or SERIAL primary key (SERIAL for simplicity in v0.1)

---

### Table: `ecr_r_assessments`

Stores responses to ECR-R assessments and calculated scores.

```sql
CREATE TABLE ecr_r_assessments (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  anxiety_score FLOAT,
  avoidance_score FLOAT,
  attachment_style VARCHAR(50),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Fields:**
- `responses`: JSON array of 36 integers (1-7), e.g., `[5, 6, 4, 1, 7, ...]`
- `anxiety_score`: Calculated mean of items 1-18 (after reverse-scoring) — float 1.0 to 7.0
- `avoidance_score`: Calculated mean of items 19-36 (after reverse-scoring) — float 1.0 to 7.0
- `attachment_style`: One of: "secure", "anxious-preoccupied", "dismissive-avoidant", "fearful-avoidant"
- `completed_at`: ISO timestamp when user submitted
- `created_at`: When record was inserted
- `updated_at`: Last modification time

**Example `responses` JSONB:**
```json
[5, 6, 4, 1, 7, 2, 3, 6, 5, 4, 3, 2, 1, 5, 6, 4, 7, 2, 3, 6, 5, 4, 1, 2, 3, 5, 6, 4, 2, 1, 3, 5, 6, 4, 7, 2]
```

---

## API Endpoints (v0.1)

### Authentication Endpoints

#### `POST /auth/register`

**Purpose:** Create a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Cases:**
- 400: Email already exists
- 400: Password too weak (< 8 chars)
- 400: Invalid email format
- 500: Database error

---

#### `POST /auth/login`

**Purpose:** Authenticate user and return JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Cases:**
- 401: Invalid email or password
- 404: User not found
- 500: Database error

---

#### `POST /auth/verify`

**Purpose:** Check if JWT token is valid

**Request Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Cases:**
- 401: Token invalid or expired
- 401: No token provided

---

### Assessment Endpoints

#### `POST /assessment/ecr-r`

**Purpose:** Submit ECR-R assessment responses

**Request Header:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "responses": [5, 6, 4, 1, 7, 2, 3, 6, 5, 4, 3, 2, 1, 5, 6, 4, 7, 2, 3, 6, 5, 4, 1, 2, 3, 5, 6, 4, 2, 1, 3, 5, 6, 4, 7, 2]
}
```

**Response (201 Created):**
```json
{
  "assessment": {
    "id": 42,
    "user_id": 1,
    "anxiety_score": 4.2,
    "avoidance_score": 3.8,
    "attachment_style": "secure",
    "completed_at": "2025-02-06T15:30:00Z"
  }
}
```

**Error Cases:**
- 400: Invalid responses array (wrong length, out of range)
- 401: Unauthorized (no valid token)
- 500: Database error

---

#### `GET /assessment/ecr-r/:assessmentId`

**Purpose:** Retrieve a specific ECR-R assessment result

**Request Header:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "assessment": {
    "id": 42,
    "user_id": 1,
    "anxiety_score": 4.2,
    "avoidance_score": 3.8,
    "attachment_style": "secure",
    "responses": [5, 6, 4, ...],
    "completed_at": "2025-02-06T15:30:00Z",
    "created_at": "2025-02-06T15:30:00Z"
  }
}
```

**Error Cases:**
- 404: Assessment not found
- 401: Unauthorized or access denied
- 500: Database error

---

#### `GET /assessment/ecr-r/user`

**Purpose:** Get all ECR-R assessments for the logged-in user

**Request Header:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "assessments": [
    {
      "id": 42,
      "anxiety_score": 4.2,
      "avoidance_score": 3.8,
      "attachment_style": "secure",
      "completed_at": "2025-02-06T15:30:00Z"
    },
    {
      "id": 43,
      "anxiety_score": 4.5,
      "avoidance_score": 3.2,
      "attachment_style": "secure",
      "completed_at": "2025-02-07T10:15:00Z"
    }
  ]
}
```

**Error Cases:**
- 401: Unauthorized
- 500: Database error

---

## Middleware

### `authMiddleware`

**Purpose:** Verify JWT token and attach user info to request

```javascript
// Usage: router.get('/protected', authMiddleware, controllerFunction)

// If token is invalid: respond with 401
// If token is valid: set req.user = { id, email } and call next()
```

---

## Security Requirements (v0.1)

✓ **Passwords:** Hashed with bcrypt (salt rounds: 10)  
✓ **Tokens:** JWT with 24-hour expiration  
✓ **CORS:** Enable for frontend domain (localhost:3000 for testing)  
✓ **Validation:** Sanitize and validate all inputs  
✓ **Rate limiting:** Implement basic rate limiting on auth endpoints  
✓ **Errors:** Never expose database details in error messages  

---

## Supabase-Specific Notes

If using Supabase instead of local PostgreSQL:

1. **Tables auto-created via SQL editor** — paste the CREATE TABLE statements above
2. **Built-in auth:** Supabase handles JWT tokens; backend can use `supabase.auth.getUser(token)`
3. **Row-level security:** Enable RLS on `ecr_r_assessments` table (users can only see their own)
4. **Environment variables:**
   ```
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_KEY=eyJhbGc...  (for backend)
   ```

---

## Environment Variables

Create `.env` file in backend root:

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/couples_app
JWT_SECRET=your_super_secret_key_min_32_chars_recommended
JWT_EXPIRATION=24h
CORS_ORIGIN=http://localhost:3000,http://localhost:8081
```

---

## Testing Endpoints

Quick test with curl:

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'

# Submit assessment (replace TOKEN with actual JWT)
curl -X POST http://localhost:3000/assessment/ecr-r \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"responses":[5,6,4,1,7,2,3,6,5,4,3,2,1,5,6,4,7,2,3,6,5,4,1,2,3,5,6,4,2,1,3,5,6,4,7,2]}'
```

---

## Performance Notes (v0.1)

- No indexing needed for v0.1 (small dataset)
- Single assessment per user is typical; add indexing on `user_id` and `created_at` in v0.2 if needed
- JSONB responses column is efficient for PostgreSQL
