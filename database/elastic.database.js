import { Client } from '@elastic/elasticsearch'
import dotenv from 'dotenv'
dotenv.config()

const ELASTIC_HOST = process.env.ELASTIC_HOST
const ELASTIC_APIKEY = process.env.ELASTIC_APIKEY

export const clientElastic = new Client({
  node: ELASTIC_HOST,
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    apiKey: ELASTIC_APIKEY
  }
})
