import { Router } from 'express'
import { AuditsController } from '../controllers/audits.controller.js'

export const routesOfAudits = Router()

routesOfAudits.get('/audits/search', AuditsController.searchAudits)
