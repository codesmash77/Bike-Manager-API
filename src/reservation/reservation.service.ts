import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { BikeService } from 'src/bike/bike.service';
import { UserService } from 'src/user/user.service';
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private ReservationRepository: Repository<Reservation>,
    private userService: UserService,
    private bikeService: BikeService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    userId: number,
    bikeId: number,
  ) {
    const reservation: Reservation = new Reservation();
    reservation.model = createReservationDto.model;
    reservation.startDate = createReservationDto.startDate;
    reservation.endDate = createReservationDto.endDate;
    reservation.userEmail = createReservationDto.userEmail;
    reservation.status = 'reserved';

    const user = await this.userService.findUserById(userId);
    const bike = await this.bikeService.findOne(bikeId);
    const condition = await this.ReservationRepository.findOne({
      where: {
        userId: userId,
        bikeId: bikeId,
        startDate: LessThan(createReservationDto.startDate),
        endDate: MoreThan(createReservationDto.startDate),
      },
    });
    console.log(condition);
    if (user && bike && !condition) {
      reservation.userId = userId;
      reservation.bikeId = bikeId;
      return await this.ReservationRepository.save(reservation);
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'UNAUTHORIZED! User or Bike doesnt exist!',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Reservation>> {
    const queryBuilder =
      this.ReservationRepository.createQueryBuilder('reservation');
    queryBuilder.orderBy('reservation.id', 'DESC');
    return paginate<Reservation>(queryBuilder, options);
  }

  async findOne(id: number) {
    return await this.ReservationRepository.findOneOrFail({
      where: { id: id },
    });
  }

  async findReserveByUserId(
    options: IPaginationOptions,
    userId: number,
  ): Promise<Pagination<Reservation>> {
    const queryBuilder = await this.ReservationRepository.createQueryBuilder(
      'reservation',
    );
    queryBuilder
      .where('reservation.userId = :userId', { userId: userId })
      .orderBy('reservation.id', 'DESC');
    return await paginate<Reservation>(queryBuilder, options);
  }

  async findReserveByBikeId(
    options: IPaginationOptions,
    bikeId: number,
  ): Promise<Pagination<Reservation>> {
    const queryBuilder = await this.ReservationRepository.createQueryBuilder(
      'reservation',
    );
    queryBuilder
      .where('reservation.bikeId = :bikeId', { bikeId: bikeId })
      .orderBy('reservation.id', 'DESC');
    return await paginate<Reservation>(queryBuilder, options);
  }

  async findReserveByUserIdAndBikeId(
    userId: number,
    bikeId: number,
    resId: number,
  ) {
    return await this.ReservationRepository.findOne({
      where: { userId: userId, bikeId: bikeId, id: resId },
    });
  }

  async update(
    userId: number,
    reserveId: number,
    updateReservationDto: UpdateReservationDto,
  ) {
    const user = await this.userService.findUserById(userId);
    const reservation = await this.ReservationRepository.findOneOrFail({
      where: { id: reserveId },
    });
    if (user && reservation)
      return await this.ReservationRepository.save({
        ...reservation,
        ...updateReservationDto,
      });
    else
      return console.error('Reservation does not exist or user does not exist');
  }

  async cancelReservation(userId: number, reserveId: number) {
    const user = await this.userService.findUserById(userId);
    const reservation = await this.ReservationRepository.findOneOrFail({
      where: { id: reserveId },
    });
    if (user && reservation && reservation.status === 'reserved') {
      reservation.status = 'cancelled';
      return await this.ReservationRepository.save({
        ...reservation,
      });
    } else
      return console.error('Reservation does not exist or user does not exist');
  }

  async remove(userId: number, reserveId: number) {
    const user = await this.userService.findUserById(userId);
    const reservation = await this.ReservationRepository.findOneOrFail({
      where: { id: reserveId },
    });
    if (user && reservation)
      return await this.ReservationRepository.delete(reserveId);
    else
      return console.error('Reservation does not exist or user does not exist');
  }
}
