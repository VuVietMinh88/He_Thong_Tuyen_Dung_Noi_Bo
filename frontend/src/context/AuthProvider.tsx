import type { ReactNode } from 'react';
import { useState } from 'react';
import { AuthContext, type AuthUser } from './AuthContext';
import { authService } from '../services/authService';

interface AuthProviderProps {
  children: ReactNode;
  user?: AuthUser | null;
}

export const AuthProvider = ({
  children,
  user = null,
}: AuthProviderProps): React.JSX.Element => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(user);

  const signIn = (authenticatedUser: AuthUser): void => {
    setCurrentUser(authenticatedUser);
  };

  const signOut = (): void => {
    setCurrentUser(null);
    authService.logout();
  };

  return (
    <AuthContext.Provider value={{ user: currentUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};