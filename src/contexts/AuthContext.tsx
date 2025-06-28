
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  accessibleReports?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  loginSSO: () => Promise<boolean>;
  logout: () => void;
}

interface LoginCredentials {
  username: string;
  password: string;
  type: 'user' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data - in real app this would come from your backend
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@company.com',
    role: 'admin'
  },
  {
    id: '2',
    username: 'user1',
    email: 'user1@company.com',
    role: 'user',
    accessibleReports: ['report1', 'report2']
  },
  {
    id: '3',
    username: 'user2',
    email: 'user2@company.com',
    role: 'user',
    accessibleReports: ['report1', 'report3']
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Mock authentication - in real app this would be an API call
    console.log('Login attempt:', credentials);
    
    // Simple mock authentication
    let foundUser: User | undefined;
    
    if (credentials.type === 'admin' && credentials.username === 'admin' && credentials.password === 'admin123') {
      foundUser = mockUsers.find(u => u.role === 'admin');
    } else if (credentials.type === 'user') {
      foundUser = mockUsers.find(u => u.username === credentials.username && u.role === 'user');
    }

    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const loginSSO = async (): Promise<boolean> => {
    // Mock SSO login - in real app this would integrate with your SSO provider
    console.log('SSO login attempt');
    
    // For demo, we'll simulate successful SSO login as a regular user
    const ssoUser: User = {
      id: 'sso_user',
      username: 'sso.user',
      email: 'sso.user@company.com',
      role: 'user',
      accessibleReports: ['report1', 'report2', 'report3']
    };
    
    setUser(ssoUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(ssoUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, loginSSO, logout }}>
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
