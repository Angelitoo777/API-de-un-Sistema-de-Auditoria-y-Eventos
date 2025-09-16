import { connectRabbitmq } from '../services/rabbitmq.services.js'
import { clientElastic } from '../database/elastic.database.js'
import { clientRedis } from '../database/redis.database.js'

const exchange = 'outbox_notifications'
const routingKey = 'user.created'
const client = clientRedis()

const startConsumer = async () => {
  try {
    const channel = await connectRabbitmq()

    await channel.assertExchange(exchange, 'topic')
    const q = await channel.assertQueue('userOutBox')

    await channel.bindQueue(q.queue, exchange, routingKey)

    await channel.prefetch(1)

    channel.consume(q.queue, async (msg) => {
      const userData = JSON.parse(msg.content.toString())
      console.log('[Consumer] Indexando contenido en elastic search')

      const eventId = crypto.randomUUID()

      try {
        await clientElastic.index({
          index: 'audits',
          id: eventId,
          document: userData
        })
        console.log('[Consumer] Se ha indexado exitosamente')

        await client.del('audits_cache')
        channel.ack(msg)
      } catch (error) {
        channel.nack(msg)
        console.error('[Consumer] Error indexando contenido en elastic search')
      }
    })
  } catch (error) {
    console.error(error)
    throw new Error('Error iniciando el consumidor')
  }
}

startConsumer()
