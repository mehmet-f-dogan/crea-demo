import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findOne(id: number, relations: string[]) {
    const user = this.usersRepository.findOne({
      where: { id },
      relations,
    });
    if (!user) {
      throw new NotFoundException(`User not found with id: ${id}`);
    }
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(`User not found with username: ${username}`);
    }
    return user;
  }

  async activateMod(id: number) {
    const user = await this.findOne(id, []);

    if (!user.roles.includes(Role.Moderator)) {
      user.roles.push(Role.Moderator);
    }
    await this.usersRepository.save(user);
  }

  async getHistory(id: number): Promise<string[]> {
    const user = await this.findOne(id, ['tickets.session.movie']);
    if (user.tickets) {
      const movieNames = user.tickets
        .filter((ticket) => ticket.isRedeemed)
        .map((ticket) => ticket.session.movie.name);

      const result = [];
      for (const name of movieNames) {
        if (!result.includes(name)) {
          result.push(name);
        }
      }
      return result;
    }
    return [];
  }
}
