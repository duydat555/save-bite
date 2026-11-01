import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storageKeys } from '@/data/storage';
import type { Session, User } from '@/types';

type SessionState = Session & {
  signIn: (user: User) => void;
  continueAsGuest: () => void;
  completeOnboarding: () => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      isGuest: false,
      hasSeenOnboarding: false,
      signIn: (user) => set({ user, isGuest: false }),
      continueAsGuest: () => set({ user: null, isGuest: true }),
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      signOut: () => set({ user: null, isGuest: false }),
    }),
    { name: storageKeys.session, storage: createJSONStorage(() => AsyncStorage) },
  ),
);
