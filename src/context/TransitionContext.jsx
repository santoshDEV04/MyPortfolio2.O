import { createContext, useContext, useState } from 'react';

const TransitionContext = createContext();

export const PAGE_NAMES = {
  '/': 'HOME',
  '/about': 'ABOUT',
  '/projects': 'PROJECTS',
  '/skills': 'SKILLS',
  '/contact': 'CONTACT'
};

export function TransitionProvider({ children }) {
  const [pendingLabel, setPendingLabel] = useState(null);

  return (
    <TransitionContext.Provider value={{ pendingLabel, setPendingLabel }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}
