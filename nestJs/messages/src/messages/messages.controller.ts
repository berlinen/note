import { Controller, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './message.service';

@Controller('messages')
export class MessagesController {
  constructor(public mesagesService: MessagesService) {}

  @Get()
  listMessages() {
    return this.mesagesService.findAll();
  }

  @Post()
  createMessage(@Body() body: CreateMessageDto) {
    return this.mesagesService.createMessage(body.content);
  }

  @Get('/:id')
  async getMessage(@Param('id') id: string) {
    const message = await this.mesagesService.findOne(id);
    if(!message) {
      throw new NotFoundException('message not found');
    }

    return message;
  }
}
