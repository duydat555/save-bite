import type { User } from '@/types';

// Demo account — name/area from SB-015, email from SB-006/007/008. Password is NOT readable in Figma
// (shown as 8 dots) → placeholder "savebite" (8 chars).
export const demoUser: User = {
  id: 'user-minh-anh',
  email: 'minhanh@example.com',
  displayName: 'Minh Anh',
  area: 'Đà Nẵng · Khu học xá',
};

export const DEMO_PASSWORD = 'savebite';
