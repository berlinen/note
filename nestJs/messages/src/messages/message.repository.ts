import { promises } from "fs";
import { Injectable } from "@nestjs/common";

const { readFile, writeFile } = promises

@Injectable()
export class MessageRepository {
  async findOne(id: string) {
    const contents = await readFile('messages.json', 'utf8');
    const messages = JSON.parse(contents);

    return messages[id]
  }

  async findAll() {
    const contents = await readFile('messages.json', 'utf8');
    const messages = JSON.parse(contents);

    return messages;
  }

  async createMessage(content: string) {
    const contents = await readFile('messages.json', 'utf8');
    const messages = JSON.parse(contents);

    const id = Math.floor(Math.random() * 999)

    messages[id] = { id, content }

    await writeFile('messages.json', JSON.stringify(messages))
  }
}