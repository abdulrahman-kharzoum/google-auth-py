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
    const updateUserAndTokens = () => {
      if (authProvider === 'google') {
        const googleUser = authTokenManager.getUser();
        setUser(googleUser);
        setAccessToken(authTokenManager.getAccessToken());
        setRefreshToken(authTokenManager.getRefreshToken());
      } else if (authProvider === 'supabase') {
        setUser(session?.user ?? null);
        setAccessToken(session?.access_token ?? null);
        setRefreshToken(session?.refresh_token ?? null);
      } else {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
      }
    };
    updateUserAndTokens();
  }, [session, authProvider]);
  
  const googleSignIn = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/google/login?prompt=select_account`);
      
      if (!response.ok) {
        throw new Error('Failed to initiate login');
      }

      const data = await response.json();
      
      const popup = window.open(data.authorization_url, 'googleAuthPopup', 'width=600,height=700');
      if (!popup) {
        throw new Error('Pop-up blocked. Please enable pop-ups for this site.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const { authStatus, userId, error } = event.data;

      if (authStatus === 'success' && userId) {
        const initialized = await authTokenManager.initialize(userId);
        if (initialized) {
          setAuthProvider('google');
        }
      } else if (error) {
        console.error('OAuth error from pop-up:', error);
      }
      setIsLoading(false);
    };

    window.addEventListener('message', handleMessage);

    // Initial session check
    const checkSession = async () => {
      setLoading(true);
      const storedUserId = localStorage.getItem('user_id');
      if (storedUserId) {
        const initialized = await authTokenManager.initialize(storedUserId);
        if (initialized) {
          setAuthProvider('google');
          setLoading(false);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setAuthProvider(session ? 'supabase' : null);
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Only update if not a Google session
      if (authProvider !== 'google') {
        setSession(session);
        setAuthProvider(session ? 'supabase' : null);
      }
    });

    return () => {
      window.removeEventListener('message', handleMessage);
      subscription.unsubscribe();
    };
  }, [authProvider]);

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
    if (authProvider === 'supabase') {
      await supabase.auth.signOut();
      setSession(null);
      setAuthProvider(null);
    } else if (authProvider === 'google') {
      await authTokenManager.logout();
      setAuthProvider(null);
    }
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
