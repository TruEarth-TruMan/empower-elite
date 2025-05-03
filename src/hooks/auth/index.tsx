import { useState, useEffect, createContext, useContext } from 'react';
import { getBetaRequestByEmail } from '@/utils/betaStorage';
import { BetaRequest } from '@/types/beta';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'BCBA' | 'RBT' | 'client' | 'parent' | 'user';
  name?: string;
  clientId?: string;
  assignedClientName?: string;
}

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'BCBA' | 'RBT' | 'client' | 'parent' | 'user';
  createdAt: string;
  betaStatus?: 'pending' | 'approved' | 'declined';
  name?: string; // Added for compatibility
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading
  isAdmin: boolean;
  isBCBA: boolean;
  isRBT: boolean;
  isClient: boolean;
  isParent?: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signIn?: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
  signOut?: () => Promise<void>;
  signUp?: (email: string, password: string, role: string, name: string) => Promise<{success: boolean; error?: string}>;
  getBetaStatus: (email: string) => Promise<BetaRequest | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for development
const demoUsers = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as const,
    name: 'Admin User',
    id: 'admin-1',
  },
  {
    email: 'sarah@bcba-example.com',
    password: 'bcba123',
    role: 'BCBA' as const,
    name: 'Sarah Johnson',
    id: 'bcba-1',
  },
  {
    email: 'alex@rbt-example.com',
    password: 'rbt123',
    role: 'RBT' as const,
    name: 'Alex Rodriguez',
    id: 'rbt-1',
  },
  {
    email: 'alex@client-example.com',
    password: 'client123',
    role: 'client' as const,
    name: 'Alex Client',
    id: 'client-1',
  },
  {
    email: 'parent@example.com',
    password: 'parent123',
    role: 'parent' as const,
    name: 'Parent User',
    id: 'parent-1',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth session in localStorage
    const storedUser = localStorage.getItem('empowerAuthUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Simulate fetching profile data
        setProfile({
          id: parsedUser.id,
          email: parsedUser.email,
          firstName: parsedUser.name?.split(' ')[0] || '',
          lastName: parsedUser.name?.split(' ')[1] || '',
          role: parsedUser.role,
          createdAt: new Date().toISOString(),
          name: parsedUser.name,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // First check for demo users
    const demoUser = demoUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (demoUser) {
      const user = {
        id: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
        name: demoUser.name,
      };
      
      setUser(user);
      localStorage.setItem('empowerAuthUser', JSON.stringify(user));
      
      // Set profile data
      setProfile({
        id: demoUser.id,
        email: demoUser.email,
        firstName: demoUser.name?.split(' ')[0] || '',
        lastName: demoUser.name?.split(' ')[1] || '',
        role: demoUser.role,
        createdAt: new Date().toISOString(),
        name: demoUser.name,
      });
      
      return true;
    }

    // If no demo user, check for approved beta users
    const betaRequest = await getBetaStatus(email);
    
    if (betaRequest && betaRequest.status === 'approved') {
      // Convert 'other' role to 'user' if needed
      const userRole = betaRequest.role === 'other' ? 'user' as const : betaRequest.role;
      
      const user: User = {
        id: `beta-${betaRequest.id}`,
        email: betaRequest.email,
        role: userRole,
        name: `${betaRequest.firstName} ${betaRequest.lastName}`,
      };
      
      setUser(user);
      localStorage.setItem('empowerAuthUser', JSON.stringify(user));
      
      // Set profile data
      setProfile({
        id: `beta-${betaRequest.id}`,
        email: betaRequest.email,
        firstName: betaRequest.firstName,
        lastName: betaRequest.lastName,
        role: userRole,
        createdAt: betaRequest.submittedAt,
        betaStatus: betaRequest.status,
        name: `${betaRequest.firstName} ${betaRequest.lastName}`,
      });
      
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('empowerAuthUser');
  };

  // Add signIn function for Auth/Login.tsx compatibility
  const signIn = async (email: string, password: string): Promise<{success: boolean; error?: string}> => {
    const success = await login(email, password);
    return { success, error: success ? undefined : 'Invalid email or password' };
  };

  // Make signOut return a promise
  const signOut = async (): Promise<void> => {
    logout();
    return Promise.resolve();
  };

  const signUp = async (email: string, password: string, role: string, name: string): Promise<{success: boolean; error?: string}> => {
    try {
      // For now, simply log in the user after signup
      const success = await login(email, password);
      return { success, error: success ? undefined : 'Failed to create account' };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const getBetaStatus = async (email: string): Promise<BetaRequest | null> => {
    return getBetaRequestByEmail(email);
  };

  const isAdmin = user?.role === 'admin';
  const isBCBA = user?.role === 'BCBA';
  const isRBT = user?.role === 'RBT';
  const isClient = user?.role === 'client';
  const isParent = user?.role === 'parent';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isLoading: loading,
        isAdmin,
        isBCBA,
        isRBT,
        isClient,
        isParent,
        login,
        logout,
        signIn,
        signOut,
        signUp,
        getBetaStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
