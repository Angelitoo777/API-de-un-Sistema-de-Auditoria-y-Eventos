import { searchAndCacheAudits } from '../services/audits.services.js'

export class AuditsController {
  static async searchAudits (req, res) {
    const query = req.query

    if (Object.keys(query).length === 0) {
      return res.status(400).json({ message: 'Se necesita un parametro para la busqueda' })
    }
    try {
      const audits = await searchAndCacheAudits(query)

      return res.status(200).json(audits)
    } catch (error) {
      console.error(error)
      return res.status(500).json('Error interno del servidor')
    }
  }
}
