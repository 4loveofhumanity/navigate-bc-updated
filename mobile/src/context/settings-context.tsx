import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import type { UserPreferences } from '@/types/domain';

const STORAGE_KEY = 'pugliese-navigate.preferences.v2';

const defaultPreferences: UserPreferences = {
  onboardingComplete: false,
  loginComplete: false,
  selectedSports: [],
  userType: 'student',
  privacyMode: true,
  autoLogin: false,
  showCourses: true,
  showTransactions: true,
  showAppointments: true,
  showHolds: true,
  showCareer: true,
  showTimeAndPayroll: false,
  safetyAlerts: true,
  eventReminders: false,
  puglieseIntroSeen: false,
};

type SettingsContextValue = {
  preferences: UserPreferences;
  hydrated: boolean;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  completeOnboarding: (answers: Pick<UserPreferences, 'politicalParty' | 'selectedSports' | 'identity'>) => void;
  resetPreferences: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored && active) {
          setPreferences({ ...defaultPreferences, ...(JSON.parse(stored) as Partial<UserPreferences>) });
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, []);

  function save(next: UserPreferences) {
    setPreferences(next);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function updatePreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
    save({ ...preferences, [key]: value });
  }

  function resetPreferences() {
    save(defaultPreferences);
  }

  function completeOnboarding(answers: Pick<UserPreferences, 'politicalParty' | 'selectedSports' | 'identity'>) {
    save({ ...preferences, ...answers, onboardingComplete: true, loginComplete: true });
  }

  return (
    <SettingsContext.Provider value={{ preferences, hydrated, updatePreference, completeOnboarding, resetPreferences }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const value = useContext(SettingsContext);
  if (!value) throw new Error('useSettings must be used inside SettingsProvider');
  return value;
}
