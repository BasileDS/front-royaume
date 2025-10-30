// PWA Installation Handler
let deferredPrompt;

// Écouter l'événement beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA: beforeinstallprompt event fired');
  // Empêcher le mini-infobar de s'afficher sur mobile
  e.preventDefault();
  // Stocker l'événement pour pouvoir déclencher l'installation plus tard
  deferredPrompt = e;
  
  // Vous pouvez ici afficher un bouton personnalisé d'installation
  // Par exemple, créer un événement custom que votre app React peut écouter
  window.dispatchEvent(new CustomEvent('pwa-installable', { detail: { canInstall: true } }));
});

// Fonction pour déclencher l'installation PWA
window.installPWA = async () => {
  if (!deferredPrompt) {
    console.log('PWA: No deferred prompt available');
    return false;
  }
  
  // Afficher le prompt d'installation
  deferredPrompt.prompt();
  
  // Attendre que l'utilisateur réponde au prompt
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`PWA: User response to the install prompt: ${outcome}`);
  
  // Réinitialiser la variable
  deferredPrompt = null;
  
  return outcome === 'accepted';
};

// Écouter l'événement appinstalled
window.addEventListener('appinstalled', () => {
  console.log('PWA: App installed successfully');
  deferredPrompt = null;
  window.dispatchEvent(new CustomEvent('pwa-installed'));
});

// Détection si l'app est déjà installée
window.isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches 
    || window.navigator.standalone 
    || document.referrer.includes('android-app://');
};

// Vérifier au chargement
if (window.isPWAInstalled()) {
  console.log('PWA: App is running in standalone mode');
  window.dispatchEvent(new CustomEvent('pwa-running-standalone'));
}

console.log('PWA: Installation handler loaded');
