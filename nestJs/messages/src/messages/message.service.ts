import { MessageRepository } from "./message.repository";

export class MessagesService {
  messagesRepo: MessageRepository;

  constructor() {
    // service is creating its own dependecies
    // do not this on real App
    this.messagesRepo = new MessageRepository();
  }

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