import Fastify, { FastifyInstance } from 'fastify'
import { Server } from 'socket.io'
import { ParticipantDirectory } from './infrastructure/persistence/ParticipantDirectory'
import { Message, NoticeBoard } from './domain/NoticeBoard'
import { MessageIsEmptyError } from './shared/errors/text-is-empty-error'
import { PostMessage } from './application/use-cases/PostMessage'
import { SocketIoBroadcaster } from './infrastructure/adapter/SocketIoBroadcaster'

export function build(): { fastifyInstance: FastifyInstance; io: Server } {
  const participant = new ParticipantDirectory()
  const board = new NoticeBoard(50)
  const fastifyInstance = Fastify({
    logger: true
  })

  const io = new Server(fastifyInstance.server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })
  const postMessage = new PostMessage(board, { postedAt: new Date() }, new SocketIoBroadcaster(io))

  io.use((socket, next) => {
    const name = String(socket.handshake.auth?.name ?? '').trim()

    if (name.length > 0) {
      participant.add(socket.id, name)
      socket.data.name = participant.nameOf(socket.id)

      return next()
    }

    return next(new Error('INVALID_AUTHOR_NAME'))
  })

  io.on('connect', (socket) => {
    participant.add(socket.id, socket.data.name)

    socket.emit('welcome', {
      participantId: socket.id,
      name: socket.data.name,
      messages: [...board.recentMessages()]
    })

    socket.on('post', (payload: { text?: string }, ack?: (r: unknown) => void) => {
      try {
        postMessage.execute({
          author: socket.data.name,
          text: payload?.text ?? ''
        } as Message)
        ack?.({ ok: true })
      } catch (error) {
        const code = (error as { code?: string }).code ?? 'INTERNAL_ERROR'
        ack?.({ ok: false, code, message: (error as Error).message })
      }
    })

    socket.on('disconnect', () => {
      participant.remove(socket.id)
    })
  })

  return { fastifyInstance, io }
}
