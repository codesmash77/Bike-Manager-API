import { forwardRef, Module } from '@nestjs/common';
import { BikeService } from './bike.service';
import { BikeController } from './bike.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Bike } from './entities/bike.entity';
import { ReservationModule } from 'src/reservation/reservation.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bike]),
    forwardRef(() => UserModule),
    forwardRef(() => ReservationModule),
    forwardRef(() => ReviewModule),
  ],
  controllers: [BikeController],
  providers: [BikeService],
  exports: [BikeService],
})
export class BikeModule {}
