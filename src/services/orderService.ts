import { offerRepository } from '@/data/repositories/offerRepository';
import { reservationRepository } from '@/data/repositories/reservationRepository';
import type { Reservation, ReservationWithOffer } from '@/types';

async function withOffer(r: Reservation): Promise<ReservationWithOffer | undefined> {
  const offer = await offerRepository.getById(r.offerId);
  return offer ? { ...r, offer } : undefined;
}

export const orderService = {
  createReservation: async (offerId: string, quantity = 1) => {
    const offer = await offerRepository.getById(offerId);
    if (!offer) throw new Error('Offer not found');
    const reservation = await reservationRepository.create({
      offerId,
      quantity,
      slotStart: offer.pickupStart,
      slotEnd: offer.pickupEnd,
    });
    return { ...reservation, offer } satisfies ReservationWithOffer;
  },

  setStatus: (id: string, status: Reservation['status']) =>
    reservationRepository.setStatus(id, status),

  getReservation: async (id: string) => {
    const r = await reservationRepository.getById(id);
    return r ? withOffer(r) : undefined;
  },

  listReservations: async () => {
    const list = await reservationRepository.list();
    const joined = await Promise.all(list.map(withOffer));
    return joined.filter((r): r is ReservationWithOffer => r !== undefined);
  },
};
