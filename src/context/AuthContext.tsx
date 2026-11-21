import React, {createContext, useContext, useState} from 'react';
import {User} from '../types';

// Demo accounts. Replace with a real API call when a backend is available.
const USERS: Array<User & {password: string}> = [
  {username: 'admin', password: 'admin123', name: 'School Admin', role: 'admin'},
  {username: 'teacher', password: 'teacher123', name: 'Class Teacher', role: 'teacher'},
];

type AuthContextValue = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string) => {
    const match = USERS.find(
      u => u.username === username.trim().toLowerCase() && u.password === password,
    );
    if (!match) {
      return false;
    }
    setUser({username: match.username, name: match.name, role: match.role});
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
