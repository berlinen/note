import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

 async function bootstrap() {
   // 创建一个应用程序的实例
   const app = await NestFactory.create(AppModule)

   await app.listen(3000)
 }


bootstrap()