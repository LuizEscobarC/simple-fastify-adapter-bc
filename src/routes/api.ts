import { FastifyInstance } from 'fastify'
import { TextTooLongError } from '../shared/errors/text-too-long-error'
import { PostMessage } from '../application/use-cases/PostMessage'
import { Message, NoticeBoard } from '../domain/NoticeBoard'
import { ListMessages } from '../application/use-cases/ListMessages'
import { SocketIoBroadcaster } from '../infrastructure/adapter/SocketIoBroadcaster'
import { Server } from 'socket.io'
import { LoggingBroadcaster } from '../infrastructure/adapter/LoggingBroadcaster'

interface EchoBody {
  text: string
}

export async function routes(app: FastifyInstance, io: Server): Promise<FastifyInstance> {
  app.get('/api/health', async (request, reply) => {
    return { status: 'ok' }
  })

  app.get<{ Querystring: { limit?: number } }>(
    '/api/items',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              minimum: 1
            }
          }
        }
      }
    },
    async (request) => {
      let limit = request.query.limit || 5
      const response: number[] = []
      for (let i = 0; i < limit; i++) {
        response.push(i)
      }

      return response
    }
  )

  app.post<{ Body: EchoBody }>(
    '/api/echo',
    {
      schema: {
        body: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string'
            }
          }
        }
      }
    },
    async (request, reply) => {
      const text = request.body.text
      if (text.length > 10) throw new TextTooLongError()
      return reply.status(201).send({
        ...request.body,
        recievedAt: new Date().toISOString()
      })
    }
  )

  app.post<{ Body: Message }>(
    '/api/messages',
    {
      schema: {
        body: {
          type: 'object',
          required: ['author', 'text'],
          properties: {
            author: {
              type: 'string'
            },
            text: {
              type: 'string'
            }
          }
        }
      }
    },
    async (request, reply) => {
      let { author, text } = request.body
      author =
        new PostMessage(new NoticeBoard(50), { postedAt: new Date('2026-01-01') }, new LoggingBroadcaster()).execute({
          author,
          text
        })[0]?.author ?? ''
      return reply.status(201).send({
        author,
        recievedAt: new Date().toISOString()
      })
    }
  )

  app.get<{ Querystring: { limit?: number } }>(
    '/api/messages',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              minimum: 1
            }
          }
        }
      }
    },
    async (request, reply) => {
      let { limit } = request.query ?? undefined
      let messages = new ListMessages(new NoticeBoard(50)).execute(limit)
      return reply.status(200).send({
        messages
      })
    }
  )

  return app
}
