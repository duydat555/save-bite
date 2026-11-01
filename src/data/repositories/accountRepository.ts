import { helpTopics, impactEntries, notificationsSeed } from '@/data/mock/account';
import type { HelpTopic, ImpactEntry, NotificationItem } from '@/types';

import { simulateLatency } from './latency';

export const accountRepository = {
  async notifications(): Promise<NotificationItem[]> {
    await simulateLatency();
    return notificationsSeed;
  },
  async helpTopics(): Promise<HelpTopic[]> {
    await simulateLatency(150, 300);
    return helpTopics;
  },
  async impact(): Promise<ImpactEntry[]> {
    await simulateLatency();
    return impactEntries;
  },
};
