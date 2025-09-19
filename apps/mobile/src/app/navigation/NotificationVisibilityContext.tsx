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

  return (
    <NotificationVisibilityContext.Provider value={{ notificationVisible, setNotificationVisible }}>
      {children} {/* ✅ Bu şekilde süslü parantez içinde yazıldığı sürece HİÇBİR UYARI vermez */}
    </NotificationVisibilityContext.Provider>
  );
};
