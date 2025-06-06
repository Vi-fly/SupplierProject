import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'admin' | 'school' | 'supplier' | null;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  userRole: UserRole;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const cleanupAuthState = () => {
  localStorage.removeItem('supabase.auth.token');
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        setSession(currentSession);
        
        if (event === 'SIGNED_IN' && currentSession) {
          setLoading(true);
          setTimeout(async () => {
            const profile = await fetchUserProfile(currentSession.user.id);
            
            if (profile) {
              setUser({
                id: currentSession.user.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as UserRole
              });
              
              if (profile.role === 'admin') {
                navigate('/admin');
              } else if (profile.role === 'school') {
                navigate('/school-dashboard');
              } else if (profile.role === 'supplier') {
                navigate('/supplier-dashboard');
              }
            } else {
              setUser({
                id: currentSession.user.id,
                name: currentSession.user.email?.split('@')[0] || 'User',
                email: currentSession.user.email || '',
                role: 'school'
              });
            }
            setLoading(false);
          }, 0);
        } else if (event === 'SIGNED_OUT' || !currentSession) {
          setUser(null);
          setLoading(false);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          const profile = await fetchUserProfile(initialSession.user.id);
          
          if (profile) {
            setUser({
              id: initialSession.user.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole
            });
          } else {
            setUser({
              id: initialSession.user.id,
              name: initialSession.user.email?.split('@')[0] || 'User',
              email: initialSession.user.email || '',
              role: 'school'
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        console.log('Pre-signout failed, continuing with login');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      if (!data || !data.user) throw new Error('Login failed: No user data returned');
      
      toast({
        title: "Logged in successfully",
        description: `Welcome back!`,
      });
      
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Login failed",
        description: err.message || "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      setUser(null);
      setSession(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      
      navigate('/');
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Logout failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setLoading(true);
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        console.log('Pre-signout failed, continuing with registration');
      }
      
      // Register user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }
        }
      });
      
      if (error) throw error;
      if (!data || !data.user) throw new Error('Registration failed: No user data returned');

      // FIX: Use upsert instead of insert to handle existing profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name,
            email,
            role,
          },
        ]);
      
      if (profileError) throw profileError;
      
      toast({
        title: "Welcome to EduVendorsElite! 🎉",
        description: `Hi ${name}, your account has been created successfully. Please check your email to verify your account.`,
        duration: 5000,
      });
      
    } catch (error) {
      const err = error as Error;
      console.error('Registration failed:', err);
      toast({
        title: "Registration failed",
        description: err.message || "An error occurred during registration. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    userRole: user?.role || null,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;