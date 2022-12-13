import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constants } from 'src/utils/constants';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user: User = new User();
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.role = Constants.ROLES.REGULAR_ROLE;
    return this.UserRepository.save(user).catch((e) => {
      if (/(email)[\s\S]+(already exists)/.test(e.detail)) {
        throw new BadRequestException(
          'Account with this email already exists.',
        );
      }
      return e;
    });
  }

  async findAll() {
    return await this.UserRepository.find();
  }

  findUserById(id: number) {
    return this.UserRepository.findOneOrFail({ where: { id: id } });
  }

  findUserbyEmail(email: string) {
    return this.UserRepository.findOne({ where: { email: email } });
  }

  async upgradeUser(id: number) {
    const user = await this.UserRepository.findOneOrFail({ where: { id: id } });
    if (user.role === Constants.ROLES.REGULAR_ROLE) {
      user.role = Constants.ROLES.ADMIN_ROLE;
    }
    return await this.UserRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.UserRepository.findOneOrFail({ where: { id: id } });
    if (user) {
      return await this.UserRepository.save({
        ...user,
        ...updateUserDto,
      });
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.UserRepository.findOneOrFail({
      where: { id: id, email: Not(updateUserDto.email) },
    });
    if (user) {
      return await this.UserRepository.save({
        ...user,
        ...updateUserDto,
      });
    }
  }

  remove(id: number) {
    return this.UserRepository.delete(id);
  }
}
