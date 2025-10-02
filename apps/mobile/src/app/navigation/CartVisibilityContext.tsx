import React, { createContext, useState, useContext } from 'react';

type CartContextType = {
  cartVisible: boolean;
  setCartVisible: (visible: boolean) => void;
};

export const CartVisibilityContext = createContext<CartContextType>({
  cartVisible: false,
  setCartVisible: () => {},
});

export const CartVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartVisible, setCartVisible] = useState(false);
  
  // Guard: children null ise null döndür
  if (!children) return null;

  return (
    <CartVisibilityContext.Provider value={{ cartVisible, setCartVisible }}>
      {children}
    </CartVisibilityContext.Provider>
  );
};

export const useCartVisibility = () => useContext(CartVisibilityContext);
