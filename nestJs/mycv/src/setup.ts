
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session')

export const setup = (app) => {
  app.use(cookieSession({
    keys: ['cookie']
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
}