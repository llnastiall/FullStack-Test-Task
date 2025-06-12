import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import {UserEntity} from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(UserEntity)
      private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  // async findById(id: number): Promise<UserEntity | null> {
  //   return this.userRepo.findOne({ where: { id } });
  // }

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }
}
