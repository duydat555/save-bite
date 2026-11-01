import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import type { StoreApi } from 'zustand';

import { useAccountStore } from '@/store/accountStore';
import { useDevFlags } from '@/store/devFlags';
import { useFilters } from '@/store/filterStore';
import { usePantryDraft } from '@/store/pantryDraft';
import { usePantryStore } from '@/store/pantryStore';
import { useSavedStore } from '@/store/savedStore';
import { useSearchStore } from '@/store/searchStore';
import { useSessionStore } from '@/store/sessionStore';
import { useUi } from '@/store/uiStore';

/**
 * Wipes everything the demo persisted (session, pantry, account, saved, searches, reservations) and puts every store
 * back to its initial state, then restarts from the splash. Used by the dev hub "Đặt lại toàn bộ dữ liệu demo".
 */
export async function resetDemoData() {
  const keys = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith('savebite.'));
  await AsyncStorage.multiRemove(keys);
  resetStore(useSessionStore);
  resetStore(usePantryStore);
  resetStore(useAccountStore);
  resetStore(useSavedStore);
  resetStore(useSearchStore);
  resetStore(useDevFlags);
  resetStore(useFilters);
  resetStore(usePantryDraft);
  resetStore(useUi);
  // setState re-persists the initial values; remove them again so the next launch is truly fresh.
  await AsyncStorage.multiRemove(keys);
  router.replace('/');
}

function resetStore<T>(store: StoreApi<T>) {
  store.setState(store.getInitialState(), true);
}
