import React, { createContext, useState, useContext } from 'react';

type UserMenuContextType = {
  userMenuVisible: boolean;
  setUserMenuVisible: (visible: boolean) => void;
};

export const UserMenuVisibilityContext = createContext<UserMenuContextType>({
  userMenuVisible: false,
  setUserMenuVisible: () => {},
});

export const UserMenuVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  
  // Guard: children null ise null döndür
  if (!children) return null;

  return (
    <UserMenuVisibilityContext.Provider value={{ userMenuVisible, setUserMenuVisible }}>
      {children}
    </UserMenuVisibilityContext.Provider>
  );
};

export const useUserMenuVisibility = () => useContext(UserMenuVisibilityContext);