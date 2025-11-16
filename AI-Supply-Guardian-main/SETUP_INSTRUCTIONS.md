# AI Supply Guardian - Setup Instructions

## 🚀 Quick Start Guide

### Step 1: Set Up Supabase

1. **Create a Supabase Account**

   - Go to [supabase.com](https://supabase.com)
   - Sign up or sign in

2. **Create a New Project**

   - Click "New Project"
   - Give it a name (e.g., "AI-Supply-Guardian")
   - Set a strong database password
   - Choose a region close to you
   - Wait for the project to be created (~2 minutes)

3. **Get Your Credentials**
   - Once created, go to **Project Settings** (⚙️ icon on the left sidebar)
   - Click on **API** section
   - You'll see:
     - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
     - **anon/public key** (a long string starting with `eyJ...`)
   - Copy both of these

### Step 2: Configure Your Environment

1. **Open the `.env` file** in your project root
2. **Replace the placeholder values** with your actual credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 3: Enable Email Authentication in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Configure email settings:
   - Go to **Authentication** → **Email Templates**
   - You can customize the email templates (optional)
4. For development, you can disable email confirmation:
   - Go to **Authentication** → **Providers** → **Email**
   - Toggle off "Confirm email" (for testing only)
   - ⚠️ **Important:** Re-enable this in production!

### Step 4: Install Dependencies & Run

1. **Install dependencies** (if not already done):

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:5173`

### Step 5: Test the Authentication

1. **Click "Get Started"** or **"Sign In"** on the landing page
2. **Create a new account**:
   - Fill in your name, email, and password
   - Click "Create Account"
   - If email confirmation is enabled, check your email
   - If disabled, you can sign in immediately
3. **Sign in** with your credentials
4. **You should see the Dashboard!** 🎉

## 🔧 Authentication Features

### What's Included:

✅ **Sign Up** - Create new accounts with email/password
✅ **Sign In** - Authenticate existing users
✅ **Sign Out** - Secure logout functionality
✅ **Protected Routes** - Dashboard only accessible when logged in
✅ **Persistent Sessions** - Stay logged in across page refreshes
✅ **User Profile** - Display user's name and email in dashboard
✅ **Form Validation** - Client-side validation for all inputs
✅ **Error Handling** - Clear error messages for users
✅ **Loading States** - Visual feedback during authentication
✅ **Responsive Design** - Works on all devices

### How It Works:

1. **AuthContext** (`src/contexts/AuthContext.tsx`):

   - Manages global authentication state
   - Provides `user`, `session`, `signUp`, `signIn`, `signOut` functions
   - Listens for authentication changes

2. **Supabase Client** (`src/lib/supabase.ts`):

   - Configured with your environment variables
   - Handles all API calls to Supabase

3. **Auth Components**:

   - `AuthModal` - Modal container for auth forms
   - `SignInForm` - Login form with validation
   - `SignUpForm` - Registration form with validation

4. **Protected Access**:
   - App automatically redirects based on auth state
   - Landing page shows auth buttons when logged out
   - Dashboard shows user info and sign out when logged in

## 📊 Optional: View Your Users in Supabase

1. Go to **Authentication** → **Users** in Supabase dashboard
2. You'll see all registered users
3. You can manually verify emails, delete users, etc.

## 🐛 Troubleshooting

### "Missing Supabase environment variables" Error

- Make sure you've created the `.env` file
- Check that the variable names are correct: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after editing `.env`

### "Invalid login credentials" Error

- Make sure you're using the correct email/password
- Check if email confirmation is required
- Verify the user exists in Supabase dashboard

### Email Not Received

- Check your spam folder
- For development, disable email confirmation in Supabase
- Use a real email address (not a temporary one)

### Can't Sign Up

- Check Supabase dashboard for any auth restrictions
- Make sure your password is at least 6 characters
- Try a different email address

## 🎯 Next Steps

Now that authentication is working, you can:

- Build out the supplier management features
- Add AI email analysis functionality
- Implement real-time alerts
- Store user-specific data in Supabase database
- Add password reset functionality
- Implement OAuth providers (Google, GitHub, etc.)

## 📝 Important Security Notes

⚠️ **Never commit your `.env` file to git!**

- It's already in `.gitignore`
- Only share credentials through secure channels
- Use different credentials for production

✅ **Production Checklist:**

- [ ] Enable email confirmation
- [ ] Set up custom SMTP for emails
- [ ] Configure rate limiting
- [ ] Set up Row Level Security (RLS) in Supabase
- [ ] Use environment-specific credentials
- [ ] Enable 2FA for Supabase dashboard

## 🆘 Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [React + Supabase Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-react)

Good luck with your AI Supply Guardian project! 🚀
