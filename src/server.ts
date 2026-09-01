import { build } from './app.js'
import { staticRoutes } from './plugins/static.js'
import { routes } from './routes/api.js'
import cors from '@fastify/cors'
const { fastifyInstance: app, io } = build()

app.register(cors, {
  origin: true
})

staticRoutes(app)

routes(app, io)

app.setErrorHandler((error: any, _request, reply) => {
  if ('code' in error) {
    return reply.status(400).send({
      code: error.code,
      message: error.message
    })
  }
  reply.status(500).send({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Erro interno.'
  })
})

app.listen({ port: 3000, host: '0.0.0.0' }, (error, address) => {
  if (error) {
    app.log.error(error)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
