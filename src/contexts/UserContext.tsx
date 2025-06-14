import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  isPremium: boolean;
  togglePremium: () => void;
  user: {
    name: string;
    email: string;
    company: string;
    memberSince: string;
  };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);

  const togglePremium = () => setIsPremium(prev => !prev);

  const user = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    company: 'Your Company Ltd',
    memberSince: 'January 2024'
  };

  return (
    <UserContext.Provider value={{ isPremium, togglePremium, user }}>
      {children}
    </UserContext.Provider>
  );
};