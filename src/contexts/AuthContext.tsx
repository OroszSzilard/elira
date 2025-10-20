'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { useRouter } from 'next/navigation';

export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
  UNIVERSITY_ADMIN = 'university_admin'
}

interface AuthUser extends User {
  role?: UserRole;
  universityId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permission matrix - exact implementation from roadmap
const permissions: Record<UserRole, { resource: string; actions: string[] }[]> = {
  [UserRole.STUDENT]: [
    { resource: 'courses', actions: ['read', 'enroll'] },
    { resource: 'lessons', actions: ['read'] },
    { resource: 'quizzes', actions: ['read', 'submit'] },
    { resource: 'profile', actions: ['read', 'update'] }
  ],
  [UserRole.INSTRUCTOR]: [
    { resource: 'courses', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'lessons', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'quizzes', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'students', actions: ['read'] },
    { resource: 'analytics', actions: ['read'] }
  ],
  [UserRole.ADMIN]: [
    { resource: '*', actions: ['*'] }
  ],
  [UserRole.UNIVERSITY_ADMIN]: [
    { resource: 'university', actions: ['read', 'update'] },
    { resource: 'departments', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'instructors', actions: ['read', 'create', 'update'] },
    { resource: 'courses', actions: ['read', 'approve'] },
    { resource: 'students', actions: ['read', 'create', 'update'] }
  ]
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch additional user data - exact implementation from roadmap
  const fetchUserData = async (firebaseUser: User): Promise<AuthUser> => {
    try {
      const getCurrentUser = httpsCallable(functions, 'getCurrentUser');
      const result = await getCurrentUser();
      const userData = result.data as any;
      
      return {
        ...firebaseUser,
        role: userData.role,
        universityId: userData.universityId
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return firebaseUser;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const enrichedUser = await fetchUserData(firebaseUser);
        setUser(enrichedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const enrichedUser = await fetchUserData(result.user);
      setUser(enrichedUser);
      
      // Redirect based on role - exact implementation from roadmap
      switch (enrichedUser.role) {
        case UserRole.ADMIN:
          router.push('/admin/dashboard');
          break;
        case UserRole.INSTRUCTOR:
          router.push('/instructor/dashboard');
          break;
        case UserRole.UNIVERSITY_ADMIN:
          router.push('/university/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    try {
      setError(null);
      
      // Create Firebase auth user
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(result.user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });
      
      // Call Cloud Function to create user document
      const createUser = httpsCallable(functions, 'createUserProfile');
      await createUser({
        uid: result.user.uid,
        email,
        ...userData
      });
      
      const enrichedUser = await fetchUserData(result.user);
      setUser(enrichedUser);
      
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if new user
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      
      if (isNewUser) {
        // Create user profile
        const createUser = httpsCallable(functions, 'createUserProfile');
        await createUser({
          uid: result.user.uid,
          email: result.user.email,
          firstName: result.user.displayName?.split(' ')[0],
          lastName: result.user.displayName?.split(' ')[1] || '',
          photoURL: result.user.photoURL
        });
      }
      
      const enrichedUser = await fetchUserData(result.user);
      setUser(enrichedUser);
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user?.role) return false;
    
    const rolePermissions = permissions[user.role];
    
    return rolePermissions.some(permission => {
      const resourceMatch = permission.resource === '*' || permission.resource === resource;
      const actionMatch = permission.actions.includes('*') || permission.actions.includes(action);
      return resourceMatch && actionMatch;
    });
  };

  const hasRole = (roles: UserRole[]): boolean => {
    return user?.role ? roles.includes(user.role) : false;
  };

  const refreshUser = async () => {
    if (user) {
      const enrichedUser = await fetchUserData(user);
      setUser(enrichedUser);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    loginWithGoogle,
    hasPermission,
    hasRole,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}