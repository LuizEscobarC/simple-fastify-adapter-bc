import { Server } from 'socket.io'
import { Broadcaster } from '../../application/ports/Broadcaster'

export class LoggingBroadcaster implements Broadcaster {
  broadcast(event: string, payload: unknown): void {
    console.log(event, payload)
  }
}
