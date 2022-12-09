import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateReservationDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'model must not be empty' })
  @IsString()
  @Length(1, 255)
  model: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'reservation must have a start date' })
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'reservation must have an end date' })
  @IsDateString()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'User Email must not be empty' })
  @IsEmail()
  userEmail: string;
}
