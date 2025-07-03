import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { HttpException } from '@nestjs/common';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Get()
  async findAllUsers(
    @Query('start') start: number = 1,
    @Query('limit') limit: number = 10,
    @Query('q') query: string | null = null,
  ) {
    if (start < 1 || limit < 1) {
      throw new HttpException('Start and limit must be greater than 0', 400);
    }

    return this.userService.findAllUsers(query || '', start, limit);
  }

  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findUserById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: Partial<User>,
  ): Promise<User | null> {
    return this.userService.updateUser(id, userData);
  }

  @Patch(':id')
  async patchUser(
    @Param('id') id: string,
    @Body() userData: Partial<User>,
  ): Promise<User | null> {
    return this.userService.updateUser(id, userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<string | null> {
    return this.userService.deleteUser(id);
  }
}
