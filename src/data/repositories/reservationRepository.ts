import { storage } from '@/data/storage';
import type { Reservation } from '@/types';

import { simulateLatency } from './latency';

const KEY = 'savebite.reservations';

async function readAll(): Promise<Reservation[]> {
  return (await storage.get<Reservation[]>(KEY)) ?? [];
}

export const reservationRepository = {
  async list(): Promise<Reservation[]> {
    await simulateLatency();
    return readAll();
  },

  async getById(id: string): Promise<Reservation | undefined> {
    await simulateLatency();
    return (await readAll()).find((r) => r.id === id);
  },

  async setStatus(id: string, status: Reservation['status']): Promise<void> {
    await simulateLatency();
    const all = await readAll();
    await storage.set(
      KEY,
      all.map((x) => (x.id === id ? { ...x, status } : x)),
    );
  },

  /** Mock: always succeeds. First order is "SB-001" / "SB-A125" as in Figma; later ones count up. */
  async create(input: {
    offerId: string;
    quantity: number;
    slotStart: string;
    slotEnd: string;
  }): Promise<Reservation> {
    await simulateLatency();
    const all = await readAll();
    const n = all.length + 1;
    const reservation: Reservation = {
      id: `res-${Date.now()}`,
      ...input,
      status: 'awaiting_pickup',
      ticketNo: `SB-${String(n).padStart(3, '0')}`,
      code: `SB-A${124 + n}`,
      createdAt: new Date().toISOString(),
    };
    await storage.set(KEY, [reservation, ...all]);
    return reservation;
  },
};
