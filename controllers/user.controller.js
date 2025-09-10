import { userModel } from '../models/user.model.js'
import { Op } from 'sequelize'
import { validateUser } from '../validations/user.validation.js'
import { userCreate } from '../services/user.services.js'

export class UserController {
  static async getAll (req, res) {
    try {
      const findUsers = await userModel.findAll()

      return res.status(200).json(findUsers)
    } catch (error) {
      console.error(error.message)
      return res.status(500).json('Error interno del servidor')
    }
  }

  static async registerUser (req, res) {
    const validation = validateUser(req.body)

    if (!validation.success) {
      return res.status(400).json({ message: 'Error de validacion', errors: validation.error.issues })
    }

    const { username, email, password } = validation.data

    try {
      const userExisting = await userModel.findOne({ where: { [Op.or]: [{ username }, { email }] } })
      if (userExisting) {
        return res.status(409).json('Usuario ya registrado')
      }

      const newUserAndOutbox = await userCreate(username, email, password)

      return res.status(201).json({ username: newUserAndOutbox.newUser.username, message: 'Usuario creado exitosamente' })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json('Error interno del servidor')
    }
  }
}
