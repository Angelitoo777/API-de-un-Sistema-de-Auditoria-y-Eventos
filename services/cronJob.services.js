import cron from 'node-cron'
import { publishTopicMessage } from './rabbitmq.services.js'
import { outboxModel } from '../models/outbox.model.js'
import { sequelize } from '../database/mysql.database.js'
import { Transaction } from 'sequelize'

export const cronJobOutBox = async () => {
  cron.schedule('* * * * *', async () => {
    const findOutBox = await outboxModel.findAll()

    for (const outBoxItem of findOutBox) {
      try {
        const message = outBoxItem.payload

        await publishTopicMessage(outBoxItem.topic, message.eventType, message.data)

        await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE }, async (transaction) => {
          await outboxModel.destroy({ where: { id: outBoxItem.id } }, { transaction })
        })
      } catch (error) {
        console.error(error)
        throw new Error('Error en el Cron Job')
      }
    }
  })
}
