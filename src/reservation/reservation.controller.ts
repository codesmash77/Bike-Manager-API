import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('reservation')
@ApiTags('Reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('/create/:userId/:bikeId')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('userId') userId: string,
    @Param('bikeId') bikeId: string,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationService.create(
      createReservationDto,
      +userId,
      +bikeId,
    );
  }

  @Get('/allReservations')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ) {
    const options = { limit, page };
    return this.reservationService.findAll(options);
  }

  @Get(':id')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }

  @Get('/Reservation/user/:userId')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findReserveByUserId(
    @Param('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ) {
    const options = { limit, page };
    return this.reservationService.findReserveByUserId(options, +userId);
  }

  @Get('/Reservation/bike/:bikeId')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findReserveByBikeId(
    @Param('bikeId') bikeId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ) {
    const options = { limit, page };
    return this.reservationService.findReserveByBikeId(options, +bikeId);
  }

  @Get(':userId/:bikeId/:resId')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findReserveByUserIdAndBikeId(
    @Param('userId') userId: string,
    @Param('bikeId') bikeId: string,
    @Param('resId') resId: string,
  ) {
    return this.reservationService.findReserveByUserIdAndBikeId(
      +userId,
      +bikeId,
      +resId,
    );
  }

  @Patch(':userId/:reserveId')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('userId') userId: string,
    @Param('reserveId') reserveId: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(
      +userId,
      +reserveId,
      updateReservationDto,
    );
  }

  @Patch('/cancelReservation/:userId/:reserveId')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  cancelReservation(
    @Param('userId') userId: string,
    @Param('reserveId') reserveId: string,
  ) {
    return this.reservationService.cancelReservation(+userId, +reserveId);
  }

  @Delete(':userId/:reserveId')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('userId') userId: string,
    @Param('reserveId') reserveId: string,
  ) {
    return this.reservationService.remove(+userId, +reserveId);
  }
}
