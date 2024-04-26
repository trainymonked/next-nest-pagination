import { UserService } from './users.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import { UsersResponseDto } from './users.response.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(@Query() params: any) {
    this.logger.log('Get users');
    const users = await this.userService.find(params.page, params.count);
    return users.map((user) => UsersResponseDto.fromUsersEntity(user));
  }

  @Get('count')
  async getUsersCount() {
    this.logger.log('Get users count');
    const count = await this.userService.countAll();
    return count;
  }
}
