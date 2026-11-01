import { offerRepository } from '@/data/repositories/offerRepository';

// UI talks to services only; swap repositories for a real API later without touching screens.
export const offerService = {
  listOffers: () => offerRepository.list(),
  searchOffers: (query: string) => offerRepository.search(query),
  getOffer: (id: string) => offerRepository.getById(id),
};
