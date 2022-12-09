import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { BikeService } from './bike.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';

@Controller('bike')
@ApiTags('Bike')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @Post(':userId')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard, new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  create(
    @Body() createBikeDto: CreateBikeDto,
    @Param('userId') userId: string,
  ) {
    return this.bikeService.create(createBikeDto, +userId);
  }

  @Get('/allBikes')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit = 100,
    @Query('model', new DefaultValuePipe('_')) model = '_',
    @Query('color', new DefaultValuePipe('_')) color = '_',
    @Query('location', new DefaultValuePipe('_')) location = '_',
    @Query('avgRating', new DefaultValuePipe(5), ParseIntPipe) avgRating = 5,
  ) {
    const options = { limit, page };
    return this.bikeService.findAll(model, color, location, avgRating, options);
  }

  @Get(':id')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.bikeService.findOne(+id);
  }

  @Patch(':userId/:bikeId')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard, new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  update(
    @Param('userId') userId: string,
    @Param('bikeId') bikeId: string,
    @Body() updateBikeDto: UpdateBikeDto,
  ) {
    return this.bikeService.update(+userId, +bikeId, updateBikeDto);
  }

  @Delete(':userId/:bikeId')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard, new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  remove(@Param('userId') userId: string, @Param('bikeId') bikeId: string) {
    return this.bikeService.remove(+userId, +bikeId);
  }
}
