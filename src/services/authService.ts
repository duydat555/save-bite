import { userRepository } from '@/data/repositories/userRepository';
import type { User } from '@/types';

export const authService = {
  register: (displayName: string, email: string): Promise<User> =>
    userRepository.register(displayName, email),
  signIn: (email: string, password: string): Promise<User | null> =>
    userRepository.signIn(email, password),
};
