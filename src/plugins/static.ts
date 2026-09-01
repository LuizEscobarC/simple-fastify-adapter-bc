import fastifyStatic from '@fastify/static'
import { FastifyInstance } from 'fastify'
import path from 'path'

export function staticRoutes(app: FastifyInstance) {
  const publicPath = path.join(__dirname, '../../public')
  app.register(fastifyStatic, {
    root: publicPath,
    prefix: '/'
  })
}
