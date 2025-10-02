import React, { createContext, useContext, useState } from 'react';

type NotificationContextType = {
  notificationVisible: boolean;
  setNotificationVisible: (visible: boolean) => void;
};

export const NotificationVisibilityContext = createContext<NotificationContextType>({
  notificationVisible: false,
  setNotificationVisible: () => {},
});

export const useNotificationVisibility = () => useContext(NotificationVisibilityContext);

export const NotificationVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  
  // Guard: children null ise null döndür
  if (!children) return null;

  return (
    <NotificationVisibilityContext.Provider value={{ notificationVisible, setNotificationVisible }}>
      {children}
    </NotificationVisibilityContext.Provider>
  );
};
