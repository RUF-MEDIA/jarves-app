// hooks/useSidebar.ts
import { useState, useEffect } from 'react';

export const useSidebar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const showSidebar = () => {
    setIsSidebarVisible(true);
    const sidebarElement = document.getElementById('meineSidebar');
    if (sidebarElement) {
      sidebarElement.style.display = 'block';
    }
  };

  const hideSidebar = () => {
    setIsSidebarVisible(false);
    const sidebarElement = document.getElementById('meineSidebar');
    if (sidebarElement) {
      sidebarElement.style.display = 'none';
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      showSidebar();
    };

    // Fügen Sie hier den entsprechenden Event-Listener für Ihre Routing-Lösung hinzu
    // Beispiel für Next.js:
    // Router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      // Entfernen Sie den Event-Listener beim Aufräumen
      // Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return { isSidebarVisible, showSidebar, hideSidebar };
};
