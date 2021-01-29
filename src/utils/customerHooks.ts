import { useEffect, useState } from 'react';

const EmptyFunc = () => {};

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
  useEffect(() => {
    console.log(networkStatus ? 'online' : 'offline');
    window.addEventListener('online', () => setNetworkStatus(navigator.onLine));
    window.addEventListener('offline', () => setNetworkStatus(navigator.onLine));
  }, [networkStatus]);
  window.removeEventListener('online', EmptyFunc);
  window.removeEventListener('offline', EmptyFunc);
  return networkStatus;
}
