import { userModel } from '../models/user.model.js'
import { outboxModel } from '../models/outbox.model.js'
import { Transaction } from 'sequelize'
import { sequelize } from '../database/mysql.database.js'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'

export const userCreate = async (username, email, password) => {
  try {
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

    return newUserAndOutbox
  } catch (error) {
    console.error(error)
  }
}
