import { DEMO_PASSWORD, demoUser } from '@/data/mock/users';
import type { User } from '@/types';

import { simulateLatency } from './latency';

export const userRepository = {
  /** Mock: any valid-looking registration succeeds. */
  async register(displayName: string, email: string): Promise<User> {
    await simulateLatency();
    return { ...demoUser, id: `user-${email}`, email, displayName };
  },

  /** Mock: the demo account (or any valid-looking email) signs in. */
  async signIn(email: string, password: string): Promise<User | null> {
    await simulateLatency();
    if (!email || !password) return null;
    if (email.toLowerCase() === demoUser.email && password !== DEMO_PASSWORD) return null;
    return email.toLowerCase() === demoUser.email
      ? demoUser
      : { ...demoUser, id: `user-${email}`, email };
  },
};
