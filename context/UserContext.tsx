'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextProps {
  user: Record<string, any> | null;
  setUser: (user: Record<string, any> | null) => void;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Record<string, any> | null>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
