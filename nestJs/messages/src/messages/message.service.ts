import { Injectable } from "@nestjs/common";
import { MessageRepository } from "./message.repository";

@Injectable()
export class MessagesService {
  constructor(public messagesRepo: MessageRepository) {}

  async findOne(id: string) {
    return this.messagesRepo.findOne(id);
  }

  async findAll() {
    return this.messagesRepo.findAll();
  }


  async createMessage(content: string) {
    return this.messagesRepo.createMessage(content);
  }
}