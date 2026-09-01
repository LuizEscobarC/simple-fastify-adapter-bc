export interface Broadcaster {
  broadcast(event: string, payload: unknown): void
}
