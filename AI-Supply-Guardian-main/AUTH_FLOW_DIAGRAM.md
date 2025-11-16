# 🔄 Authentication Flow Diagram

## How the Authentication Works

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER VISITS APP                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  AuthContext     │
                    │  Checks Session  │
                    └──────────────────┘
                              │
                              ▼
                    ╔═══════════════════╗
                    ║  Is User Logged   ║
                    ║      In?          ║
                    ╚═══════════════════╝
                      │              │
                 NO   │              │   YES
                      ▼              ▼
            ┌───────────────┐   ┌───────────────┐
            │ Landing Page  │   │   Dashboard   │
            │               │   │               │
            │ - Sign Up     │   │ - User Info   │
            │ - Sign In     │   │ - Sign Out    │
            │ - Features    │   │ - Suppliers   │
            └───────────────┘   └───────────────┘
                      │                  │
                      │                  │
        ┌─────────────┴─────────┐       │
        │                       │       │
        ▼                       ▼       │
┌──────────────┐        ┌──────────────┐│
│  Sign Up     │        │   Sign In    ││
│  Modal       │        │   Modal      ││
└──────────────┘        └──────────────┘│
        │                       │        │
        ▼                       ▼        │
┌──────────────────────────────────┐    │
│         Supabase Auth            │    │
│  - Create Account                │    │
│  - Verify Credentials            │    │
│  - Generate Session Token        │    │
└──────────────────────────────────┘    │
        │                       │        │
        │         SUCCESS       │        │
        └───────────┬───────────┘        │
                    ▼                    │
            ┌──────────────┐             │
            │ AuthContext  │             │
            │ Updates User │             │
            └──────────────┘             │
                    │                    │
                    └────────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Dashboard   │
                    │  Displayed   │
                    └──────────────┘
```

## Component Structure

```
App.tsx
  └── AuthProvider (wraps everything)
       │
       ├── LandingPage (when NOT logged in)
       │    │
       │    └── AuthModal
       │         ├── SignInForm
       │         └── SignUpForm
       │
       └── Dashboard (when logged in)
            ├── Sidebar
            │    ├── Navigation
            │    └── Sign Out Button
            │
            └── Main Content
                 ├── Dashboard Stats
                 ├── Suppliers List
                 ├── Add Supplier
                 ├── Alerts
                 ├── Email Analyzer
                 └── Settings
```

## Data Flow

```
┌────────────────────────────────────────────────────────┐
│                    AuthContext                         │
│  - Manages global authentication state                 │
│  - Provides: user, session, signUp, signIn, signOut   │
│  - Listens to Supabase auth changes                   │
└────────────────────────────────────────────────────────┘
                           │
                           │ provides auth functions
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Components                           │
│  - LandingPage: uses user to show/hide buttons        │
│  - Dashboard: uses user to display info & signOut     │
│  - SignInForm: calls signIn()                         │
│  - SignUpForm: calls signUp()                         │
└────────────────────────────────────────────────────────┘
                           │
                           │ makes API calls
                           ▼
┌────────────────────────────────────────────────────────┐
│              Supabase Client (supabase.ts)            │
│  - Configured with your URL and key                   │
│  - Handles all communication with Supabase            │
└────────────────────────────────────────────────────────┘
                           │
                           │ API requests
                           ▼
┌────────────────────────────────────────────────────────┐
│                    Supabase Backend                    │
│  - Authentication service                              │
│  - User management                                     │
│  - Session management                                  │
│  - Email sending                                       │
└────────────────────────────────────────────────────────┘
```

## User Journey Examples

### New User Registration

```
1. User clicks "Get Started"
2. AuthModal opens with SignUpForm
3. User fills: name, email, password
4. User clicks "Create Account"
5. SignUpForm validates input
6. SignUpForm calls signUp() from AuthContext
7. AuthContext calls Supabase API
8. Supabase creates user account
9. Success message shown
10. User can now sign in
```

### Existing User Login

```
1. User clicks "Sign In"
2. AuthModal opens with SignInForm
3. User enters email & password
4. User clicks "Sign In"
5. SignInForm calls signIn() from AuthContext
6. AuthContext calls Supabase API
7. Supabase verifies credentials
8. Supabase returns session token
9. AuthContext updates user state
10. App redirects to Dashboard
```

### User Logout

```
1. User clicks "Sign Out" in sidebar
2. Dashboard calls signOut() from AuthContext
3. AuthContext calls Supabase API
4. Supabase invalidates session
5. AuthContext clears user state
6. App redirects to Landing Page
```

### Session Persistence

```
1. User closes browser
2. User opens browser again
3. App loads
4. AuthContext checks for existing session
5. Supabase validates session token
6. If valid → show Dashboard
7. If invalid → show Landing Page
```

## File Responsibilities

| File                                 | Purpose                                          |
| ------------------------------------ | ------------------------------------------------ |
| `src/lib/supabase.ts`                | Initialize Supabase client with credentials      |
| `src/contexts/AuthContext.tsx`       | Manage global auth state, provide auth functions |
| `src/components/Auth/AuthModal.tsx`  | Modal container, switches between signin/signup  |
| `src/components/Auth/SignInForm.tsx` | Login form with validation                       |
| `src/components/Auth/SignUpForm.tsx` | Registration form with validation                |
| `src/App.tsx`                        | Route between Landing/Dashboard based on auth    |
| `src/main.tsx`                       | Wrap app with AuthProvider                       |
| `.env`                               | Store Supabase credentials (YOU MUST FILL THIS)  |

## Environment Variables

```
.env file contains:
├── VITE_SUPABASE_URL → Your Supabase project URL
└── VITE_SUPABASE_ANON_KEY → Your Supabase public API key

⚠️ NEVER commit .env to git (already in .gitignore)
✅ Use .env.example as template for others
```

## Security Features

```
✅ Passwords are hashed by Supabase
✅ Session tokens are secure and encrypted
✅ HTTPS required in production
✅ Environment variables not exposed to client
✅ CORS configured properly by Supabase
✅ Rate limiting available in Supabase
✅ Row Level Security (RLS) can be enabled
```

---

**Everything is ready! Just configure Supabase and you're good to go! 🚀**
