import { Server } from 'socket.io'
import { Broadcaster } from '../application/ports/Broadcaster'
import { Clock } from '../application/ports/Clock'
import { ListMessages, ListMessagesInterface } from '../application/use-cases/ListMessages'
import { PostMessage, PostMessageInterface } from '../application/use-cases/PostMessage'
import { NoticeBoard, NoticeBoardInterface } from '../domain/NoticeBoard'
import { LoggingBroadcaster } from './adapter/LoggingBroadcaster'
import { SocketIoBroadcaster } from './adapter/SocketIoBroadcaster'
import { ParticipantDirectory, ParticipantDirectoryInterface } from './persistence/ParticipantDirectory'
import Fastify, { FastifyInstance } from 'fastify'
import { InvalidAuthorNameError } from '../shared/errors/invalid-author-name-error'

export type Containers = {
  fastifyInstance: FastifyInstance
  io: Server
  socketIoBroadcaster: Broadcaster
  loggingBroadcaster: Broadcaster
  participantDirectory: ParticipantDirectoryInterface
  noticeBoard: NoticeBoardInterface
  listMessages: ListMessagesInterface
  postMessage: PostMessageInterface
  error: Error
  authorNameError: Error
  clock: Clock
}

export function buildContainer(): Containers {
  const fastifyInstance = Fastify({
    logger: true
  })

  const io = new Server(fastifyInstance.server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  const noticeBoard = new NoticeBoard(50)
  const socketIoBroadcaster = new SocketIoBroadcaster(io)
  const postedAt: Clock = { postedAt: new Date() }
  const container: Containers = {
    fastifyInstance: fastifyInstance,
    io: io,
    socketIoBroadcaster: socketIoBroadcaster,
    loggingBroadcaster: new LoggingBroadcaster(),
    participantDirectory: new ParticipantDirectory(),
    noticeBoard: noticeBoard,
    listMessages: new ListMessages(noticeBoard),
    postMessage: new PostMessage(noticeBoard, postedAt, socketIoBroadcaster),
    error: new Error(),
    authorNameError: new InvalidAuthorNameError(),
    clock: postedAt
  }
  return container
}
