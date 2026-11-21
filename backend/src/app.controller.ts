import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from './app.service.js';
import { Public } from './common/decorators/public.decorator.js';

// @ApiTags('App')
@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @ApiOperation({ summary: 'Healthcheck / Chào mừng' })
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
