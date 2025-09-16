import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'
import { jwtMiddleware } from '../middlewares/jwt.middleware.js'

export const routesOfUser = Router()

routesOfUser.get('/users', jwtMiddleware, UserController.getAll)

routesOfUser.post('/register', UserController.registerUser)
routesOfUser.post('/login', UserController.loginUser)
routesOfUser.patch('/users/:id', jwtMiddleware, UserController.updateUser)
routesOfUser.delete('/users/:id', jwtMiddleware, UserController.deleteUser)
