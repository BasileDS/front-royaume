import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useServiceWorker() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker enregistré avec succès:', registration);
          })
          .catch((error) => {
            console.log('Échec de l\'enregistrement du Service Worker:', error);
          });
      });
    }
  }, []);
}
