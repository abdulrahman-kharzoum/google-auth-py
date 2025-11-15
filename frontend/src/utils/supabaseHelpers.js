import { supabase } from './supabaseClient';

/**
 * Supabase Helper Functions for Frontend
 * Easy-to-use functions for common database operations
 */

// ============================================================================
// USER DATA OPERATIONS
// ============================================================================

/**
 * Save user data to Supabase
 * @param {Object} userData - User data object
 * @returns {Promise<Object>} Response with data or error
 */
export const saveUserData = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        user_id: userData.user_id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
    
    console.log('✅ User data saved to Supabase:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user data from Supabase
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data or error
 */
export const getUserData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    
    console.log('✅ User data retrieved from Supabase:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error getting user data:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// SESSION/TOKEN OPERATIONS
// ============================================================================

/**
 * Save OAuth session/tokens to Supabase
 * @param {Object} sessionData - Session data with tokens
 * @returns {Promise<Object>} Response with data or error
 */
export const saveSession = async (sessionData) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .upsert({
        user_id: sessionData.user_id,
        email: sessionData.email,
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token,
        expires_at: sessionData.expires_at,
        scopes: sessionData.scopes || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
    
    console.log('✅ Session saved to Supabase');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error saving session:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get session from Supabase
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Session data or error
 */
export const getSession = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    
    console.log('✅ Session retrieved from Supabase');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error getting session:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete session from Supabase
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Response
 */
export const deleteSession = async (userId) => {
  try {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    
    console.log('✅ Session deleted from Supabase');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting session:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// ACTIVITY LOG OPERATIONS
// ============================================================================

/**
 * Log user activity to Supabase
 * @param {Object} activity - Activity data
 * @returns {Promise<Object>} Response
 */
export const logActivity = async (activity) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: activity.user_id,
        action: activity.action,
        details: activity.details || {},
        timestamp: new Date().toISOString()
      });

    if (error) throw error;
    
    console.log('✅ Activity logged to Supabase:', activity.action);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error logging activity:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user activity logs
 * @param {string} userId - User ID
 * @param {number} limit - Number of logs to retrieve (default: 50)
 * @returns {Promise<Object>} Activity logs or error
 */
export const getActivityLogs = async (userId, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    console.log(`✅ Retrieved ${data.length} activity logs from Supabase`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error getting activity logs:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// GENERIC DATA OPERATIONS
// ============================================================================

/**
 * Insert data into any table
 * @param {string} tableName - Name of the table
 * @param {Object} data - Data to insert
 * @returns {Promise<Object>} Response
 */
export const insertData = async (tableName, data) => {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data);

    if (error) throw error;
    
    console.log(`✅ Data inserted into ${tableName}`);
    return { success: true, data: result };
  } catch (error) {
    console.error(`❌ Error inserting data into ${tableName}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Update data in any table
 * @param {string} tableName - Name of the table
 * @param {Object} updates - Data to update
 * @param {Object} match - Match condition (e.g., { user_id: '123' })
 * @returns {Promise<Object>} Response
 */
export const updateData = async (tableName, updates, match) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .match(match);

    if (error) throw error;
    
    console.log(`✅ Data updated in ${tableName}`);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Error updating data in ${tableName}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete data from any table
 * @param {string} tableName - Name of the table
 * @param {Object} match - Match condition (e.g., { id: '123' })
 * @returns {Promise<Object>} Response
 */
export const deleteData = async (tableName, match) => {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .match(match);

    if (error) throw error;
    
    console.log(`✅ Data deleted from ${tableName}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error deleting data from ${tableName}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Query data from any table
 * @param {string} tableName - Name of the table
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Response with data
 */
export const queryData = async (tableName, options = {}) => {
  try {
    let query = supabase.from(tableName).select(options.select || '*');

    // Apply filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Apply ordering
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending !== false 
      });
    }

    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    console.log(`✅ Retrieved ${data.length} records from ${tableName}`);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Error querying ${tableName}:`, error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to real-time changes in a table
 * @param {string} tableName - Name of the table
 * @param {Function} callback - Callback function for changes
 * @param {Object} filters - Optional filters
 * @returns {Object} Subscription object
 */
export const subscribeToTable = (tableName, callback, filters = {}) => {
  const subscription = supabase
    .channel(`${tableName}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tableName,
        ...filters
      },
      (payload) => {
        console.log(`📡 Real-time update from ${tableName}:`, payload);
        callback(payload);
      }
    )
    .subscribe();

  console.log(`📡 Subscribed to ${tableName} changes`);
  
  return subscription;
};

/**
 * Unsubscribe from real-time changes
 * @param {Object} subscription - Subscription object
 */
export const unsubscribeFromTable = async (subscription) => {
  if (subscription) {
    await supabase.removeChannel(subscription);
    console.log('📡 Unsubscribed from real-time changes');
  }
};

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/*
Example 1: Save user after login
await saveUserData({
  user_id: user.uid,
  email: user.email,
  name: user.displayName,
  picture: user.photoURL
});

Example 2: Log activity
await logActivity({
  user_id: user.uid,
  action: 'login',
  details: { method: 'google_oauth' }
});

Example 3: Query with filters
const result = await queryData('activity_logs', {
  filters: { user_id: '123' },
  orderBy: { column: 'timestamp', ascending: false },
  limit: 10
});

Example 4: Real-time subscription
const subscription = subscribeToTable('users', (payload) => {
  console.log('User data changed:', payload);
});
*/