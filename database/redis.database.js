import redis from 'redis'

export const clientRedis = () => {
  const client = redis.createClient({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: process.env.REDIS_PORT ?? 6379
  })
  try {
    client.connect()
    console.log('Your redis is connected')
  } catch (error) {
    console.log(error)
  }

  return client
}
