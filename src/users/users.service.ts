import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from './user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private users: Repository<UserEntity>,
  ) {}

  findById(id: number) {
    return this.users.findOne(id);
  }

  async create(user: User) {
    const password = await hash(user.password, 10);
    return this.users.save({ ...user, password });
  }

  async findByEmailAndPassword(email: string, password: string) {
    const user = await this.users.findOne({ where: { email } });

    return user && (await compare(password, user.password)) ? user : null;
  }
}