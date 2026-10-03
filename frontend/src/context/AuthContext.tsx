import { createContext, useContext } from 'react';

export interface AuthUser {
  id: string | number;
  name: string;
  role: string;
  permissions: string[];
}

export interface AuthContextValue {
  user: AuthUser | null;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider.');
  }

  return context;
};
