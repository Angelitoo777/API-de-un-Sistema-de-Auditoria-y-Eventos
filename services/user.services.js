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

export const userUpdate = async (id, updateData) => {
  try {
    const eventId = crypto.randomUUID()

    const updateUserAndOutbox = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE }, async (transaction) => {
      const [updateUserById] = await userModel.update(updateData, { where: { id } }, { transaction })

      if (updateUserById === 0) {
        throw new Error('Usuario no encontrado o no se pudo actualizar')
      }

      const updatedUser = await userModel.findByPk(id, { transaction })

      const newOutbox = await outboxModel.create({
        messageId: eventId,
        topic: 'outbox_notifications',
        payload: {
          eventId,
          eventType: 'user.updated',
          timestamp: new Date().toISOString(),
          data: {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email

          }
        }
      }, { transaction })
      return { newOutbox, updatedUser }
    })

    return updateUserAndOutbox
  } catch (error) {
    console.error(error)
  }
}

export const deletedUser = async (id) => {
  try {
    const eventId = crypto.randomUUID()

    const deleteUserAndOutbox = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE }, async (transaction) => {
      const findUser = await userModel.findByPk(id)

      if (!findUser) {
        throw new Error('Usuario no existe')
      }

      const deletedUserById = await userModel.destroy({ where: { id } }, { transaction })

      const newOutbox = await outboxModel.create({
        messageId: eventId,
        topic: 'outbox_notifications',
        payload: {
          eventId,
          eventType: 'user.deleted',
          timestamp: new Date().toISOString(),
          data: {
            id: findUser.id,
            username: findUser.username,
            email: findUser.email,
            isDeleted: true

          }
        }
      }, { transaction })
      return { newOutbox, deletedUserById }
    })

    return deleteUserAndOutbox
  } catch (error) {
    console.error(error)
  }
}
