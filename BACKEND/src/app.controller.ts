import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MyLogger } from './logger/my.log';

@Controller()
export class AppController {
  // private myLogger = new MyLogger();
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // this.myLogger.error('Handling GET request for /', AppController.name);
    return this.appService.getHello();
  }
}
