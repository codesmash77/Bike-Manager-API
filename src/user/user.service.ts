import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constants } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
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

  remove(id: number) {
    return this.UserRepository.delete(id);
  }
}
