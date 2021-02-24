import { app } from '../app'
import log from './log'

export default function() {
  app.use(log)
}