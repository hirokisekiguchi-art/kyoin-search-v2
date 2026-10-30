type AnalyticsValue = string | number | boolean | undefined;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const send = (...args: unknown[]) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
};

export const trackEvent = (name: string, parameters: Record<string, AnalyticsValue> = {}) => {
  send('event', name, parameters);
};

export const trackPageView = (title: string) => {
  send('event', 'page_view', {
    page_title: title,
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
  });
};
