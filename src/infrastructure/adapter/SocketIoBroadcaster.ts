import { Server } from 'socket.io'
import { Broadcaster } from '../../application/ports/Broadcaster'

export class SocketIoBroadcaster implements Broadcaster {
  constructor(private readonly io: Server) {}

  broadcast(event: string, payload: unknown): void {
    this.io.emit(event, payload)
  }
}
