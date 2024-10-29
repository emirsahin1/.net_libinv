'use client'
import { User } from '@/types/User';
import React, { useState, createContext, useContext, useReducer, ReactNode } from 'react';

interface IGlobalContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const GlobalContext = createContext<IGlobalContextProps | undefined>(undefined);

export const useUser = () => {
    const context = useContext(GlobalContext);
    if (context === undefined) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  };

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>({} as User);

  return (
    <GlobalContext.Provider
      value={{
        user: currentUser,
        setUser: setCurrentUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};