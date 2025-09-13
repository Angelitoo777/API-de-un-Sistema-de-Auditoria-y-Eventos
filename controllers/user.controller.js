import { userModel } from '../models/user.model.js'
import { Op } from 'sequelize'
import { validateUser, validatePartialUser, validatePickUser } from '../validations/user.validation.js'
import { deletedUser, userCreate, userUpdate } from '../services/user.services.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

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

  static async loginUser (req, res) {
    const validation = validatePickUser(req.body)

    if (!validation.success) {
      return res.status(400).json({ message: 'Error de validacion', errors: validation.error.issues })
    }

    const { username, password } = validation.data
    try {
      const login = await userModel.findOne({ where: { username } })

      if (!login) {
        return res.status(400).json({ message: 'Credenciales incorrectas' })
      }

      const passwordMatch = await bcrypt.compare(password, login.password)

      if (!passwordMatch) {
        return res.status(400).json({ message: 'Credenciales incorrectas' })
      }

      const token = jwt.sign({
        id: login.id,
        email: login.email,
        username: login.username
      }, JWT_SECRET, {
        expiresIn: '1h'
      })

      return res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000 // 1 hr
        })
        .status(200)
        .json({
          username: login.user,
          email: login.username,
          message: 'Usuario logueado exitosamente'
        })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json('Error interno del servidor')
    }
  }

  static async updateUser (req, res) {
    const { id } = req.params
    const validation = validatePartialUser(req.body)

    if (!validation.success) {
      return res.status(400).json({ message: 'Error de validacion', errors: validation.error.issues })
    }

    const updateData = validation.data

    try {
      const result = await userUpdate(id, updateData)

      return res.status(200).json({
        username: result.updatedUser.username,
        email: result.updatedUser.email,
        message: 'Usuario actualizado exitosamente'
      })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json('Error interno del servidor')
    }
  }

  static async deleteUser (req, res) {
    const { id } = req.params

    try {
      const userDeleted = await deletedUser(id)

      return res.status(204).json(userDeleted)
    } catch (error) {
      console.error(error.message)
      return res.status(500).json('Error interno del servidor')
    }
  }
}
