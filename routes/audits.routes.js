import { Router } from 'express'
import { AuditsController } from '../controllers/audits.controller.js'
import { jwtMiddleware } from '../middlewares/jwt.middleware.js'

export const routesOfAudits = Router()

routesOfAudits.get('/audits/search', jwtMiddleware, AuditsController.searchAudits)
