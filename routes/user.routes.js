import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'

export const routesOfUser = Router()

routesOfUser.get('/users', UserController.getAll)

routesOfUser.post('/register', UserController.registerUser)
