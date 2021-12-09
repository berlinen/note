import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    // 创建实体实例
    const user = this.repo.create({ email, password })
    // 数据持久化 存入数据库 验证之类操作
    return this.repo.save(user)
  }

  findOne(id: number) {
    return this.repo.findOne(id)
  }

  find(email: string) {
    return this.repo.find({ email })
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.find(id)
    if(!user) {
      throw new Error('not found this user')
    }
    Object.assign(user, attrs)
    return this.repo.save(user)
  }

  remove() {}
}
