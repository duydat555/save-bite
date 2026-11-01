import { accountRepository } from '@/data/repositories/accountRepository';

export const accountService = {
  notifications: () => accountRepository.notifications(),
  helpTopics: () => accountRepository.helpTopics(),
  impact: () => accountRepository.impact(),
};
