import { useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface NavigationHistoryContextType {
  history: string[];
  previousRoute: string | null;
  canGoBack: boolean;
  addToHistory: (route: string) => void;
  clearHistory: () => void;
}

const NavigationHistoryContext = createContext<NavigationHistoryContextType | undefined>(undefined);

export function NavigationHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<string[]>([]);
  const segments = useSegments();
  const previousSegments = useRef<string[]>([]);

  useEffect(() => {
    // Construire la route actuelle à partir des segments
    const currentRoute = '/' + segments.join('/');
    const previousRoute = '/' + previousSegments.current.join('/');

    // Ne pas ajouter si c'est la même route ou une route vide
    if (currentRoute !== previousRoute && segments.length > 0 && currentRoute !== '/') {
      // Éviter d'ajouter les routes d'authentification à l'historique
      const isAuthRoute = segments[0] === '(auth)';
      
      if (!isAuthRoute) {
        setHistory((prev) => {
          // Ne pas dupliquer la dernière route
          if (prev[prev.length - 1] === currentRoute) {
            return prev;
          }
          
          // Limiter l'historique à 10 entrées
          const newHistory = [...prev, currentRoute];
          return newHistory.slice(-10);
        });
      }
    }

    previousSegments.current = segments;
  }, [segments]);

  const addToHistory = (route: string) => {
    setHistory((prev) => {
      if (prev[prev.length - 1] === route) {
        return prev;
      }
      const newHistory = [...prev, route];
      return newHistory.slice(-10);
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Obtenir la route précédente (avant-dernière de l'historique)
  const previousRoute = history.length >= 2 ? history[history.length - 2] : null;
  const canGoBack = history.length > 1;

  return (
    <NavigationHistoryContext.Provider
      value={{
        history,
        previousRoute,
        canGoBack,
        addToHistory,
        clearHistory,
      }}
    >
      {children}
    </NavigationHistoryContext.Provider>
  );
}

export function useNavigationHistory() {
  const context = useContext(NavigationHistoryContext);
  if (context === undefined) {
    throw new Error('useNavigationHistory must be used within a NavigationHistoryProvider');
  }
  return context;
}
