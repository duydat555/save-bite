/** Simulates network latency (200–500 ms) so UI loading states are exercised. */
export function simulateLatency(min = 200, max = 500): Promise<void> {
  const ms = Math.round(min + Math.random() * (max - min));
  return new Promise((resolve) => setTimeout(resolve, ms));
}
