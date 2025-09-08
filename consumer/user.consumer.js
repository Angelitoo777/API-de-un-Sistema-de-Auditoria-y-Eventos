import { connectRabbitmq } from '../services/rabbitmq.services.js'
import { client } from '../database/elastic.database.js'

const exchange = 'outbox_notifications'
const routingKey = 'user.created'

const startConsumer = async () => {
  try {
    const channel = await connectRabbitmq()

    await channel.assertExchange(exchange, 'topic')
    const q = await channel.assertQueue('userOutBox')

    await channel.bindQueue(q.queue, exchange, routingKey)

    channel.consume(q.queue, async (msg) => {
      const userData = JSON.parse(msg.content.toString())
      console.log('[Consumer] Indexando contenido en elastic search')

      try {
        await client.index({
          index: 'audits',
          id: userData.id,
          document: userData
        })
        console.log('[Consumer] Se ha indexado exitosamente')
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
