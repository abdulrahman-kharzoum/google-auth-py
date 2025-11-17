import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User as SupabaseUser, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import authTokenManager from "../lib/authTokenManager";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8050';

interface GoogleUser {
  user_id: string;
  email: string;
  name: string;
  picture: string;
}

type User = SupabaseUser | GoogleUser | null;

interface AuthContextType {
  user: User;
  session: Session | null;
  loading: boolean;
  isLoading: boolean; // For Google Sign-In loading state
  authProvider: 'supabase' | 'google' | null;
  accessToken: string | null;
  refreshToken: string | null;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<void>; // Updated function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authProvider, setAuthProvider] = useState<'supabase' | 'google' | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      const urlParams = new URLSearchParams(window.location.search);
      const authStatus = urlParams.get('auth');
      const userId = urlParams.get('user_id');
      const error = urlParams.get('error');

      if (authStatus === 'success' && userId) {
        window.history.replaceState({}, document.title, window.location.pathname);
        const initialized = await authTokenManager.initialize(userId);
        if (initialized) {
          setUser(authTokenManager.getUser());
          setAccessToken(authTokenManager.getAccessToken());
          setRefreshToken(authTokenManager.getRefreshToken());
          setAuthProvider('google');
          setLoading(false);
          return;
        }
      } else if (error) {
        console.error('OAuth error from redirect:', decodeURIComponent(error));
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const storedUserId = localStorage.getItem('user_id');
      if (storedUserId) {
        const initialized = await authTokenManager.initialize(storedUserId);
        if (initialized) {
          setUser(authTokenManager.getUser());
          setAccessToken(authTokenManager.getAccessToken());
          setRefreshToken(authTokenManager.getRefreshToken());
          setAuthProvider('google');
          setLoading(false);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);
        setAccessToken(session.access_token);
        setRefreshToken(session.refresh_token);
        setAuthProvider('supabase');
      }
      
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (authTokenManager.getUser() === null) {
          setSession(session);
          setUser(session?.user ?? null);
          setAccessToken(session?.access_token ?? null);
          setRefreshToken(session?.refresh_token ?? null);
          setAuthProvider(session ? "supabase" : null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const googleSignIn = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/google/login?prompt=consent`);
      if (!response.ok) {
        throw new Error('Failed to initiate login');
      }
      const data = await response.json();
      window.location.href = data.authorization_url;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const provider = authProvider; // Capture the provider before state changes
    setLoading(true);
    
    if (provider === 'supabase') {
      await supabase.auth.signOut();
    } else if (provider === 'google') {
      await authTokenManager.logout();
    }

    // Reset all auth-related state
    setUser(null);
    setSession(null);
    setAccessToken(null);
    setRefreshToken(null);
    setAuthProvider(null);
    setLoading(false);
  };

  const value = {
    user,
    session,
    loading,
    isLoading,
    authProvider,
    accessToken,
    refreshToken,
    signUp,
    signIn,
    signOut,
    googleSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
