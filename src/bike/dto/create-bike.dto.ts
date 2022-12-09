import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateBikeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'model must not be empty' })
  @IsString()
  @Length(1, 255)
  model: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'color must not be empty' })
  @IsString()
  @Length(1, 255)
  color: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'location must not be empty' })
  @IsString()
  @Length(3, 255)
  location: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'isAvailable must not be empty' })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'average rating must not be empty' })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0)
  @Max(5)
  avgRating: number;
}
