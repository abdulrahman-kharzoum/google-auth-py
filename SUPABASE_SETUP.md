# Supabase Setup Guide

Complete guide for integrating Supabase with your Google OAuth Test Project.

## 📦 What's Been Added

✅ Supabase client: [`frontend/src/utils/supabaseClient.js`](frontend/src/utils/supabaseClient.js)  
✅ Helper functions: [`frontend/src/utils/supabaseHelpers.js`](frontend/src/utils/supabaseHelpers.js)  
✅ Environment variables configured  
✅ Supabase dependency added to `package.json`

## 🗄️ Supabase Configuration

Your project is connected to the **yiarrshhxltesgoehqse** Supabase instance.

### Environment Variables

```env
REACT_APP_SUPABASE_URL=https://yiarrshhxltesgoehqse.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 Installation

```bash
cd frontend
npm install
```

This installs `@supabase/supabase-js@^2.74.0`

## 📊 Required Database Tables

Create these tables in your Supabase project:

### 1. Users Table

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  picture TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_email ON users(email);
```

### 2. Sessions Table

```sql
CREATE TABLE sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scopes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
```

### 3. Activity Logs Table

```sql
CREATE TABLE activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
```

## 🔧 Usage Examples

### Basic Import

```javascript
import { supabase } from './utils/supabaseClient';
import { 
  saveUserData, 
  logActivity,
  queryData 
} from './utils/supabaseHelpers';
```

### Example 1: Save User After Login

```javascript
import { saveUserData, logActivity } from './utils/supabaseHelpers';

// After Firebase authentication
const handleLoginSuccess = async (firebaseUser) => {
  // Save user to Supabase
  await saveUserData({
    user_id: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
    picture: firebaseUser.photoURL
  });

  // Log the login activity
  await logActivity({
    user_id: firebaseUser.uid,
    action: 'login',
    details: { 
      method: 'firebase_google_oauth',
      timestamp: new Date().toISOString()
    }
  });
};
```

### Example 2: Save OAuth Session/Tokens

```javascript
import { saveSession } from './utils/supabaseHelpers';

const handleOAuthCallback = async (sessionData) => {
  await saveSession({
    user_id: sessionData.user_id,
    email: sessionData.email,
    access_token: sessionData.access_token,
    refresh_token: sessionData.refresh_token,
    expires_at: sessionData.expires_at,
    scopes: sessionData.scopes || []
  });
};
```

### Example 3: Query User Activity

```javascript
import { getActivityLogs } from './utils/supabaseHelpers';

const ViewActivityLogs = () => {
  const loadLogs = async (userId) => {
    const result = await getActivityLogs(userId, 20);
    
    if (result.success) {
      console.log('Activity logs:', result.data);
    }
  };
  
  return (
    <button onClick={() => loadLogs(user.uid)}>
      Load Activity
    </button>
  );
};
```

### Example 4: Real-Time Updates

```javascript
import { subscribeToTable, unsubscribeFromTable } from './utils/supabaseHelpers';

const MyComponent = () => {
  useEffect(() => {
    // Subscribe to user changes
    const subscription = subscribeToTable('users', (payload) => {
      console.log('User data changed:', payload);
      // Update UI accordingly
    }, { filter: `user_id=eq.${userId}` });

    // Cleanup
    return () => {
      unsubscribeFromTable(subscription);
    };
  }, [userId]);
};
```

### Example 5: Generic Data Operations

```javascript
import { insertData, updateData, queryData } from './utils/supabaseHelpers';

// Insert data
await insertData('custom_table', {
  user_id: user.uid,
  custom_field: 'value'
});

// Update data
await updateData('users', 
  { name: 'New Name' }, 
  { user_id: user.uid }
);

// Query with filters
const result = await queryData('activity_logs', {
  filters: { user_id: user.uid, action: 'login' },
  orderBy: { column: 'timestamp', ascending: false },
  limit: 10
});
```

## 🔄 Complete Integration Example

Here's a complete example of integrating Firebase Auth with Supabase:

```javascript
import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { saveUserData, logActivity, getActivityLogs } from './utils/supabaseHelpers';

function App() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);

  // Handle login
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Save to Supabase
      await saveUserData({
        user_id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        picture: firebaseUser.photoURL
      });

      // Log activity
      await logActivity({
        user_id: firebaseUser.uid,
        action: 'login',
        details: { method: 'google_oauth' }
      });

      setUser(firebaseUser);
      
      // Load activity logs
      const logs = await getActivityLogs(firebaseUser.uid);
      if (logs.success) {
        setActivities(logs.data);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      if (user) {
        await logActivity({
          user_id: user.uid,
          action: 'logout',
          details: {}
        });
      }
      
      await signOut(auth);
      setUser(null);
      setActivities([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}</h2>
          <button onClick={handleLogout}>Logout</button>
          
          <h3>Activity Logs</h3>
          <ul>
            {activities.map(log => (
              <li key={log.id}>
                {log.action} - {new Date(log.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
}
```

## 📚 Available Helper Functions

### User Operations
- `saveUserData(userData)` - Save/update user
- `getUserData(userId)` - Get user data

### Session Operations
- `saveSession(sessionData)` - Save OAuth session
- `getSession(userId)` - Get session
- `deleteSession(userId)` - Delete session

### Activity Logging
- `logActivity(activity)` - Log user activity
- `getActivityLogs(userId, limit)` - Get activity logs

### Generic Operations
- `insertData(table, data)` - Insert into any table
- `updateData(table, updates, match)` - Update any table
- `deleteData(table, match)` - Delete from any table
- `queryData(table, options)` - Query any table

### Real-Time
- `subscribeToTable(table, callback, filters)` - Subscribe to changes
- `unsubscribeFromTable(subscription)` - Unsubscribe

## 🔐 Security & Row Level Security (RLS)

Enable Row Level Security in Supabase:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data" 
ON users FOR SELECT 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" 
ON users FOR UPDATE 
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Similar policies for other tables
```

## 🎯 Benefits of Using Supabase

✅ **Real-time updates** - Instant data synchronization  
✅ **PostgreSQL database** - Powerful relational database  
✅ **Built-in authentication** - Can work with Firebase Auth  
✅ **Row Level Security** - Secure data access  
✅ **RESTful API** - Automatic API generation  
✅ **Storage** - File uploads and CDN  
✅ **Edge Functions** - Serverless functions  

## 🔄 Firebase + Supabase Architecture

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌───────────┐  ┌──────────┐
│  Firebase │  │ Supabase │
│   Auth    │  │ Database │
└───────────┘  └──────────┘
```

Use Firebase for authentication and Supabase for data storage!

## 📊 Monitoring & Debugging

### Console Logs
All helper functions log their operations to the console:
- `✅` - Success
- `❌` - Error
- `📡` - Real-time updates

### Supabase Dashboard
Monitor your data at: https://supabase.com/dashboard/project/yiarrshhxltesgoehqse

View:
- Table data
- Real-time subscriptions
- API logs
- Database performance

## 🛠️ Testing Supabase Connection

```javascript
import { supabase } from './utils/supabaseClient';

// Test connection
const testConnection = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('count');
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('✅ Connected to Supabase!');
  }
};
```

## 📖 Next Steps

1. **Create tables** in Supabase using the SQL above
2. **Install dependencies**: `npm install`
3. **Test connection** with the test function
4. **Integrate with Firebase Auth** as shown in examples
5. **Monitor data** in Supabase dashboard

## 🤝 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **JavaScript Client**: https://supabase.com/docs/reference/javascript
- **Real-time**: https://supabase.com/docs/guides/realtime

---

## ✅ Summary

Your project now has:
- ✅ Supabase client configured
- ✅ Helper functions for easy data operations
- ✅ Real-time subscription support
- ✅ Activity logging capability
- ✅ Session storage
- ✅ User data management

**Start saving data to Supabase instantly!** 🚀