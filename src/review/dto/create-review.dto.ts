import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'comment must not be empty' })
  @IsString()
  @Length(1, 255)
  comment: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'review must have a rating' })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'User Name must not be empty' })
  @IsString()
  userName: string;
}
