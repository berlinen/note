import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessageRepository } from './message.repository';
import { MessagesService } from './message.service';

@Module({
  controllers: [MessagesController],
  providers: [MessageRepository, MessagesService]
})
export class MessagesModule {}
