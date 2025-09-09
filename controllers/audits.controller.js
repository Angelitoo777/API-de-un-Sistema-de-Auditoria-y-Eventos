import { clientElastic } from '../database/elastic.database.js'
import { clientRedis } from '../database/redis.database.js'

const client = clientRedis()

export class AuditsController {
  static async searchAudits (req, res) {
    const queryUser = req.query.id || req.query.email

    if (!queryUser) {
      return res.status(400).json({ message: 'Se necesita un parametro para la busqueda' })
    }
    try {
      const cache = await client.get('audits_cache')

      if (cache) {
        return res.status(200).json(JSON.parse(cache))
      }

      const findAudits = await clientElastic.search({
        index: 'audits',
        body: {
          query: {
            multi_match: {
              query: queryUser,
              fields: ['id', 'email']
            }
          }
        }
      })

      const result = findAudits.hits.hits.map(hit => hit._source)

      await client.setEx('audits_cache', 3600, JSON.stringify(result))

      return res.status(200).json(result)
    } catch (error) {
      console.error(error)
      return res.status(500).json('Error interno del servidor')
    }
  }
}
