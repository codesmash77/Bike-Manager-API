import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //FOR EVERYONE
  @Post('/signUp')
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  //FOR ADMIN
  @Get()
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard, new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  findAll(@Req() req) {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard, new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  findUserById(@Param('id') id: string, @Req() req) {
    return this.userService.findUserById(+id);
  }

  @Get('/mail/:email')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard, new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  findUserbyEmail(@Param('email') email: string, @Req() req) {
    return this.userService.findUserbyEmail(email);
  }

  @Patch('/upgrade/:id')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard, new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  upgradeUser(@Param('id') id: string, @Req() req) {
    return this.userService.upgradeUser(+id);
  }

  @Patch(':id')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard, new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch('/update/:id')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  //FOR ADMIN
  @Delete(':id')
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard, new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  remove(@Param('id') id: string, @Req() req) {
    return this.userService.remove(+id);
  }
}
