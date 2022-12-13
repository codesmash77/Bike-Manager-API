import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { Bike } from './entities/bike.entity';

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(Bike)
    private BikeRepository: Repository<Bike>,
    private userService: UserService,
  ) {}

  async create(createBikeDto: CreateBikeDto, userId: number) {
    const bike: Bike = new Bike();
    bike.model = createBikeDto.model;
    bike.color = createBikeDto.color;
    bike.location = createBikeDto.location;
    bike.isAvailable = createBikeDto.isAvailable;
    bike.avgRating = createBikeDto.avgRating;

    const user = await this.userService.findUserById(userId);
    if (user?.role === 'ADMIN') {
      bike.userId = userId;
      return await this.BikeRepository.save(bike);
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'UNAUTHORIZED! Regular Users are not allowed to create bikes',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async findAll(
    model: string,
    color: string,
    location: string,
    avgRating: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Bike>> {
    const queryBuilder = await this.BikeRepository.createQueryBuilder('bike');
    queryBuilder
      .where('bike.model like :model', { model: `%${model}%` })
      .andWhere('bike.color like :color', { color: `%${color}%` })
      .andWhere('bike.location like :location', { location: `%${location}%` })
      .andWhere('bike.avgRating <= :avgRating', {
        avgRating: avgRating,
      })
      .andWhere('bike.isAvailable = :isAvailable', {
        isAvailable: true,
      })
      .orderBy('bike.id', 'DESC');
    return paginate<Bike>(queryBuilder, options);
  }

    async findAllAdmin(
    model: string,
    color: string,
    location: string,
    avgRating: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Bike>> {
    const queryBuilder = await this.BikeRepository.createQueryBuilder('bike');
    queryBuilder
      .where('bike.model like :model', { model: `%${model}%` })
      .andWhere('bike.color like :color', { color: `%${color}%` })
      .andWhere('bike.location like :location', { location: `%${location}%` })
      .andWhere('bike.avgRating <= :avgRating', {
        avgRating: avgRating,
      })
      .orderBy('bike.id', 'DESC');
    return paginate<Bike>(queryBuilder, options);
  }

  async findOne(id: number) {
    return await this.BikeRepository.findOneOrFail({ where: { id: id } });
  }

  async update(userId: number, bikeId: number, updateBikeDto: UpdateBikeDto) {
    const user = await this.userService.findUserById(userId);
    const bike = await this.BikeRepository.findOneOrFail({
      where: { id: bikeId },
    });
    if (user?.role === 'ADMIN' && bike)
      return await this.BikeRepository.save({ ...bike, ...updateBikeDto });
    else
      return console.error('Regular Users are not authorised to update Bikes');
  }

  async remove(userId: number, bikeId: number) {
    const user = await this.userService.findUserById(userId);
    const bike = await this.BikeRepository.findOneOrFail({
      where: { id: bikeId },
    });
    if (user?.role === 'ADMIN' && bike) {
      return await this.BikeRepository.delete(bikeId);
    } else
      return console.error('Regular Users are not authorised to delete Bikes');
  }

  async saveBike(bike: Bike) {
    return this.BikeRepository.save({ ...bike });
  }
}
