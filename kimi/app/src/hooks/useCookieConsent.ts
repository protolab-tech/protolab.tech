import { useState, useEffect, useCallback } from 'react';

export type CookieConsent = 'accepted' | 'rejected' | 'custom' | null;

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = 'protolab-cookie-consent';
const PREFERENCES_KEY = 'protolab-cookie-preferences';

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(STORAGE_KEY) as CookieConsent;
    const storedPreferences = localStorage.getItem(PREFERENCES_KEY);
    
    if (storedConsent) {
      setConsent(storedConsent);
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = useCallback(() => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setConsent('accepted');
    setPreferences(newPreferences);
    localStorage.setItem(STORAGE_KEY, 'accepted');
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPreferences));
    setShowBanner(false);
    setShowCustomize(false);
  }, []);

  const rejectAll = useCallback(() => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setConsent('rejected');
    setPreferences(newPreferences);
    localStorage.setItem(STORAGE_KEY, 'rejected');
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPreferences));
    setShowBanner(false);
    setShowCustomize(false);
  }, []);

  const saveCustom = useCallback((customPreferences: CookiePreferences) => {
    setConsent('custom');
    setPreferences(customPreferences);
    localStorage.setItem(STORAGE_KEY, 'custom');
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(customPreferences));
    setShowBanner(false);
    setShowCustomize(false);
  }, []);

  const openCustomize = useCallback(() => {
    setShowCustomize(true);
  }, []);

  const canUseAnalytics = consent === 'accepted' || 
    (consent === 'custom' && preferences.analytics);

  return {
    consent,
    preferences,
    showBanner,
    showCustomize,
    acceptAll,
    rejectAll,
    saveCustom,
    openCustomize,
    setShowCustomize,
    canUseAnalytics,
  };
}
