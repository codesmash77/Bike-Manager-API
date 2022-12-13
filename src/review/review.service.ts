import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { BikeService } from 'src/bike/bike.service';
import { ReservationService } from 'src/reservation/reservation.service';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private ReviewRepository: Repository<Review>,
    private reservationService: ReservationService,
    private bikeService: BikeService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: number,
    bikeId: number,
  ) {
    const review: Review = new Review();
    review.comment = createReviewDto.comment;
    review.rating = createReviewDto.rating;
    review.userName = createReviewDto.userName;
    let avg = 0;
    const bike = await this.bikeService.findOne(bikeId);
    const reservation =
      await this.reservationService.findReserveByUserIdAndBikeId(
        userId,
        bikeId,
      );
    if (reservation && reservation.status !== 'cancelled') {
      review.userId = userId;
      review.bikeId = bikeId;
      const reviews = await this.findAllReviewsByBikeId(bikeId);
      reviews.forEach((r, i) => {
        avg += r.rating;
      });
      bike.avgRating = (avg + review?.rating) / (reviews.length + 1);
      await this.bikeService.saveBike(bike);
      return await this.ReviewRepository.save(review);
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error:
            'UNAUTHORIZED! User doesnot have an active reservation of the Bike, so he cannot add a review!',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  findAllReviewsByBikeId(bikeId: number) {
    return this.ReviewRepository.find({
      where: { bikeId: bikeId },
    });
  }

  findOne(id: number) {
    return this.ReviewRepository.find({
      where: { id: id },
    });
  }
}
