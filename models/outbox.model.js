import { sequelize } from '../database/mysql.database.js'
import { DataTypes } from 'sequelize'

export const outboxModel = sequelize.define('outbox', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  messageId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payload: {
    type: DataTypes.JSON,
    allowNull: false
  }
})
