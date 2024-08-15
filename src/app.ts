import dotenv from 'dotenv'
import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fjwt from '@fastify/jwt'
import userRoutes from './modules/users.route'
import { userSchmas } from './modules/users.schema'


dotenv.config()

export const fastify = Fastify({
  logger: true
})

declare module "fastify"{
  export interface FastifyInstance {
    authenticate: any
  }
}

fastify.register(fjwt, {
  secret: process.env.JWT_SECRET
})

fastify.decorate("authenticate", async(req: FastifyRequest, reply:FastifyReply) => {
  try {
    await req.jwtVerify()
  } catch (error) {
    return reply.send(error)
  }
})

fastify.get('/checkup', async () => {
  return { status: 'OK' }
})

fastify.get('/ping', async () => {
  return 'pong\n'
})


const start = async () => {
  for(const schema of userSchmas){
    fastify.addSchema(schema)
  }
    fastify.register(userRoutes, {prefix: "/api/v1/users"})
  try {
    await fastify.listen({ port: process.env.PORT })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()