import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '../common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from './user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private users: Repository<UserEntity>,
    private hash: HashService,
  ) {}

  findById(id: number) {
    return this.users.findOne(id);
  }

  async create(user: User) {
    const password = await this.hash.make(user.password);
    return this.users.save({ ...user, password });
  }

  findByEmail(email: string) {
    return this.users.findOne({ where: { email } });
  }

  async findByEmailAndPassword(email: string, password: string) {
    const user = await this.findByEmail(email);

    return user && (await this.hash.compare(password, user.password))
      ? user
      : null;
  }

  async verifyEmail(email: string) {
    const updateResult = await this.users.update(
      { email },
      { isEmailVerified: true },
    );

    return !!updateResult.affected;
  }

  async updatePassword(id: number, password: string) {
    const hash = await this.hash.make(password);

    return this.users.update({ id }, { password: hash });
  }
}
