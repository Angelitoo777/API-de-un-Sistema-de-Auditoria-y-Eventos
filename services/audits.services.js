import { clientRedis } from '../database/redis.database.js'
import { clientElastic } from '../database/elastic.database.js'
import crypto from 'crypto'

const client = clientRedis()

export const searchAndCacheAudits = async (query) => {
  const cacheKey = `audits_cache:${crypto.createHash('md5').update(JSON.stringify(query)).digest('hex')}`

  try {
    const cache = await client.get(cacheKey)

    if (cache) {
      console.log('Datos obtenidos de la caché de Redis.')
      return JSON.parse(cache)
    }

    const { id, email, eventType } = query

    const mustConditions = []

    if (id) {
      mustConditions.push({ match: { id } })
    }

    if (email) {
      mustConditions.push({ match: { email } })
    }

    if (eventType) {
      mustConditions.push({ match: { eventType } })
    }
    const findAudits = await clientElastic.search({
      index: 'audits',
      body: {
        query: {
          bool: {
            must: mustConditions
          }
        }
      }
    })

    const results = findAudits.hits.hits.map(hit => hit._source)

    await client.setEx(cacheKey, 3600, JSON.stringify(results))
    console.log('Datos obtenidos de Elasticsearch y almacenados en caché.')

    return results
  } catch (error) {
    console.error('Error en el servicio de búsqueda:', error)
    throw error
  }
}
