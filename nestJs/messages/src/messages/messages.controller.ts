import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './message.service';

@Controller('messages')
export class MessagesController {
  mesagesService: MessagesService

  constructor() {
    // dont do this on real app
    // use dependency injection
    this.mesagesService = new MessagesService();
  }

  @Get()
  listMessages() {
    return this.mesagesService.findAll();
  }

  @Post()
  createMessage(@Body() body: CreateMessageDto) {
    return this.mesagesService.createMessage(body.content); 
  }

  @Get('/:id')
  getMessage(@Param('id') id: string) {
    return this.mesagesService.findOne(id);
  }
}
