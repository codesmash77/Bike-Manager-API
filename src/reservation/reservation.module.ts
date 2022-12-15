import { forwardRef, Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './entities/reservation.entity';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeModule } from 'src/bike/bike.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    forwardRef(() =>UserModule),
    forwardRef(() =>BikeModule),
    forwardRef(() =>ReviewModule),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
