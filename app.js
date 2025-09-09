import express from 'express'
import { sequelize } from './database/mysql.database.js'
import dotenv from 'dotenv'
import { cronJobOutBox } from './services/cronJob.services.js'
import { routesOfUser } from './routes/user.routes.js'
import { routesOfAudits } from './routes/audits.routes.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000

try {
  await sequelize.sync({ force: false })
  console.log('Mysql is connected')
} catch (error) {
  console.error('Error connecting your database')
}

app.use(express.json())

app.use('/auth', routesOfUser)
app.use('/api', routesOfAudits)

app.get('/', (req, res) => {
  res.send('Hola mundo')
})

app.listen(PORT, async () => {
  console.log('Your server is running')
  await cronJobOutBox()
})
