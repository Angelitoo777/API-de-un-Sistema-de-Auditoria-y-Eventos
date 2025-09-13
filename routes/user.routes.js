import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'

export const routesOfUser = Router()

routesOfUser.get('/users', UserController.getAll)

routesOfUser.post('/register', UserController.registerUser)
routesOfUser.post('/login', UserController.loginUser)
routesOfUser.patch('/users/:id', UserController.updateUser)
routesOfUser.delete('/users/:id', UserController.deleteUser)
