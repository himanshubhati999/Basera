import { API_ENDPOINTS } from '../config/api';

// Generate or get visitor ID from localStorage
const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitorId');
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('visitorId', visitorId);
  }
  return visitorId;
};

// Generate or get session ID from sessionStorage
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('sessionId', sessionId);
    sessionStorage.setItem('sessionStart', Date.now().toString());
  }
  return sessionId;
};

// Track a page view
export const trackPageView = async (path) => {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const referrer = document.referrer || '';

    await fetch(API_ENDPOINTS.ANALYTICS_TRACK_PAGEVIEW, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        visitorId,
        sessionId,
        referrer
      })
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track session end
export const trackSession = async () => {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const sessionStart = sessionStorage.getItem('sessionStart');
    
    if (sessionStart) {
      const duration = Date.now() - parseInt(sessionStart);
      
      await fetch(API_ENDPOINTS.ANALYTICS_TRACK_SESSION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          visitorId,
          duration
        })
      });
    }
  } catch (error) {
    console.error('Error tracking session:', error);
  }
};

// Initialize analytics tracking
export const initAnalytics = () => {
  // Track initial page view
  trackPageView(window.location.pathname);
  
  // Track page views on route change (for SPAs)
  let lastPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      trackPageView(currentPath);
    }
  });
  
  observer.observe(document.querySelector('body'), {
    childList: true,
    subtree: true
  });
  
  // Track session end on page unload
  window.addEventListener('beforeunload', () => {
    trackSession();
  });
  
  // Track session periodically (every 5 minutes)
  setInterval(() => {
    trackSession();
  }, 5 * 60 * 1000);
};
