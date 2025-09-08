import { userModel } from '../models/user.model.js'
import { outboxModel } from '../models/outbox.model.js'
import { Transaction, Op } from 'sequelize'
import { validateUser } from '../validations/user.validation.js'
import { sequelize } from '../database/mysql.database.js'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'

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

      const eventId = crypto.randomUUID()
      const hasshPassword = await bcrypt.hash(password, 10)

      const newUserAndOutbox = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE }, async (transaction) => {
        const newUser = await userModel.create({
          username,
          email,
          password: hasshPassword
        }, { transaction })

        const newOutbox = await outboxModel.create({
          messageId: eventId,
          topic: 'outbox_notifications',
          payload: {
            eventId,
            eventType: 'user.created',
            timestamp: new Date().toISOString(),
            data: {
              id: newUser.id,
              username: newUser.username,
              email: newUser.email
            }
          }
        }, { transaction })

        return { newUser, newOutbox }
      })

      return res.status(201).json({ username: newUserAndOutbox.newUser.username, message: 'Usuario creado exitosamente' })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json('Error interno del servidor')
    }
  }
}
