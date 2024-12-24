import { Workbox } from 'workbox-window';

const swRegister = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported in the browser');
    return;
  }

  // Naik 3 level: utils -> scripts -> src -> root
  const wb = new Workbox('../../../sw.js');

  try {
    const registration = await wb.register();
    console.log('Service worker registered with scope:', registration.scope);
  } catch (error) {
    console.error('Failed to register service worker:', error);
  }
};

export default swRegister;
