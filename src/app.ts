import { FastifyInstance } from 'fastify'
import { Server } from 'socket.io'
import { Message } from './domain/NoticeBoard'
import { buildContainer } from './infrastructure/container'

export function build(): { fastifyInstance: FastifyInstance; io: Server } {
  const { noticeBoard, participantDirectory, postMessage, io, authorNameError, fastifyInstance } = buildContainer()

  io.use((socket, next) => {
    const name = String(socket.handshake.auth?.name ?? '').trim()

    if (name.length > 0) {
      participantDirectory.add(socket.id, name)
      socket.data.name = participantDirectory.nameOf(socket.id)

      return next()
    }

    return next(authorNameError)
  })

  io.on('connect', (socket) => {
    participantDirectory.add(socket.id, socket.data.name)

    socket.emit('welcome', {
      participantId: socket.id,
      name: socket.data.name,
      messages: [...noticeBoard.recentMessages()]
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
      participantDirectory.remove(socket.id)
    })
  })

  return { fastifyInstance, io }
}
