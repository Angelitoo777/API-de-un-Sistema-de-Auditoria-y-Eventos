import amqp from 'amqplib'
import dotenv from 'dotenv'
dotenv.config()

export const connectRabbitmq = async () => {
  const url = process.env.URL_RABBITMQ
  const connect = await amqp.connect(url)
  const channel = await connect.createChannel()

  console.log('Your RabbitMQ is connected')

  return channel
}

export const publishTopicMessage = async (exchange, routingKey, message) => {
  try {
    const channel = await connectRabbitmq()

    await channel.assertExchange(exchange, 'topic')

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))

    console.log(`[x] Mensaje publicado en el exchange ${exchange}`)
  } catch (error) {
    console.error(error)
    throw new Error('Error publicando en el exchange')
  }
}
