import { useNavigation } from 'expo-router';
import { useEffect, useRef, type ComponentRef, type RefObject } from 'react';
import type { TextInput } from 'react-native';

export type TextInputHandle = ComponentRef<typeof TextInput>;

/**
 * Focuses a TextInput only once the screen transition has finished. `autoFocus` raises the keyboard while the stack is
 * still sliding in, which makes the transition stutter (keyboard animation + layout + the slide compete for the frame
 * budget). A 450 ms fallback covers navigators that never emit `transitionEnd` (fade / none).
 */
export function useFocusAfterTransition(ref: RefObject<TextInputHandle | null>) {
  const navigation = useNavigation();
  const done = useRef(false);
  useEffect(() => {
    const go = () => {
      if (done.current) return;
      done.current = true;
      ref.current?.focus();
    };
    const unsub = navigation.addListener('transitionEnd' as never, go as never);
    const t = setTimeout(go, 450);
    return () => {
      unsub();
      clearTimeout(t);
    };
  }, [navigation, ref]);
}
