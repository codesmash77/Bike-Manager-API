import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('review')
@ApiTags('Reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':userId/:bikeId')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('userId') userId: string,
    @Param('bikeId') bikeId: string,
    @Param('resId') resId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(createReviewDto, +userId, +bikeId, +resId);
  }

  @Get('/Bike/:bikeId')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findAllReviewsByBikeId(@Param('bikeId') bikeId: string) {
    return this.reviewService.findAllReviewsByBikeId(+bikeId);
  }

  @Get(':id')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }
}
