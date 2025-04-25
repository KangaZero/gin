# Authentication and User Flow Sequence Diagrams

This document details the various authentication and user flows in the application using sequence diagrams.

## OAuth Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    participant C as Client (Next.js)
    participant NA as NextAuth
    participant BE as Backend (Gin)
    participant DB as User Store

    C->>NA: Click OAuth Provider Button
    NA->>NA: Handle OAuth Flow
    NA-->>C: Receive OAuth User Data
    
    Note over NA,BE: NextAuth SignIn Callback
    NA->>BE: POST /api/users/oauth<br>{email, name, provider, providerAccountId}
    
    BE->>DB: Check if user exists
    
    alt User Exists
        DB-->>BE: Return existing user
    else New User
        BE->>DB: Create new user<br>{id, email, userName, createdAt}
        DB-->>BE: Return new user
    end
    
    BE->>BE: Generate session token<br>session_{timestamp}_{userID}
    BE-->>NA: Return {data: user, token: sessionToken}
    BE-->>C: Set-Cookie: session_token<br>(HttpOnly, 1 hour expiry)
    
    NA->>NA: Store NextAuth session
    NA-->>C: Redirect to '/'
```

## Traditional Login Flow

```mermaid
sequenceDiagram
    autonumber
    participant C as Client (Next.js)
    participant BE as Backend (Gin)
    participant DB as User Store
    participant SS as Session Store

    C->>BE: POST /api/login<br>{username, password}
    
    BE->>DB: Find user by username
    
    alt User Not Found
        BE-->>C: 401 Unauthorized<br>"Invalid credentials"
    else User Found
        BE->>BE: Compare passwords (bcrypt)
        
        alt Invalid Password
            BE-->>C: 401 Unauthorized<br>"Invalid credentials"
        else Valid Password
            BE->>BE: Generate session token<br>session_{timestamp}_{userID}
            BE->>SS: Store session with expiry<br>{token: expiryTime}
            BE-->>C: Set-Cookie: session_token<br>(HttpOnly, 1 hour expiry)
            BE-->>C: 200 OK<br>{message: "Login successful",<br>data: safeUser}
        end
    end
```

## User Operations Flow

```mermaid
sequenceDiagram
    autonumber
    participant C as Client (Next.js)
    participant BE as Backend (Gin)
    participant SS as Session Store
    participant DB as User Store

    Note over C,BE: All protected routes go through SessionAuthMiddleware

    C->>BE: Protected Request<br>Cookie: session_token
    
    BE->>SS: Validate session token
    
    alt Invalid/Expired Session
        SS-->>BE: Session not found/expired
        BE-->>C: 401 Unauthorized
    else Valid Session
        SS-->>BE: Session valid
        
        alt Get Current User
            C->>BE: GET /api/users/me
            BE->>DB: Find user by ID from token
            DB-->>BE: Return user data
            BE-->>C: 200 OK {data: enrichedUser}
        
        else Update User
            C->>BE: PUT /api/users/:id<br>{email, userName, password?}
            BE->>DB: Validate unique email/username
            BE->>DB: Update user data
            BE-->>C: 200 OK {message: "Updated", data: safeUser}
        
        else Get User's Pets
            C->>BE: GET /api/users/:id/pets
            BE->>DB: Find all pets with ownerID
            DB-->>BE: Return user's pets
            BE-->>C: 200 OK {count: n, data: pets[]}
        end
    end
```

## Data Types and Structures

### User Model
```typescript
interface User {
    ID: string;
    Email: string;
    UserName: string;
    Password: string;  // Hashed with bcrypt
    CreatedAt: string; // RFC3339 format
}
```

### Pet Model
```typescript
interface Pet {
    ID: string;
    Name: string;
    Species: string;
    OwnerID: string;
    CreatedAt: string;
}
```

### Session Store
```typescript
interface SessionStore {
    [sessionToken: string]: Date; // Expiry time
}
```

## API Endpoints Overview

### Authentication Endpoints
- `POST /api/login` - Traditional login
- `POST /api/logout` - Clear session
- `POST /api/users/oauth` - OAuth user creation/login

### User Endpoints
- `GET /api/users` - List all users
- `GET /api/users/me` - Get current user
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/:id/pets` - Get user's pets

### Pet Endpoints
- `GET /api/pets` - List all pets
- `GET /api/pets/:id` - Get pet by ID
- `GET /api/pets/owner/:ownerId` - Get pets by owner
- `POST /api/pets` - Create new pet
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

## Security Notes

1. **Password Security**
   - Passwords are hashed using bcrypt
   - Salt rounds: Default cost (10)

2. **Session Security**
   - Sessions expire after 1 hour
   - Cookies are HttpOnly
   - CORS configured for localhost:1234 and localhost:3000

3. **Data Protection**
   - Passwords are never sent back to client
   - User data is sanitized using `CreateSafeUser`
   - Email uniqueness is enforced
   - Username uniqueness is enforced