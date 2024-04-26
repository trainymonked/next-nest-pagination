import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepo.find();
  }

  async find(page: number = 1, count: number = 10): Promise<UsersEntity[]> {
    return await this.usersRepo.find({ skip: count * (page - 1), take: count });
  }

  async countAll(): Promise<number> {
    return await this.usersRepo.count();
  }
}
