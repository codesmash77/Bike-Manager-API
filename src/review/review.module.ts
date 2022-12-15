import { forwardRef, Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entities/review.entity';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeModule } from 'src/bike/bike.module';
import { ReservationModule } from 'src/reservation/reservation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    forwardRef(() => UserModule),
    forwardRef(() => BikeModule),
    forwardRef(() => ReservationModule),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
