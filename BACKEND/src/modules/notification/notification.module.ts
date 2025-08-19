import { Global, Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { MyLogger } from 'src/logger/my.log';

@Global()
@Module({
    providers: [NotificationGateway, MyLogger],
    exports: [NotificationGateway],
})
export class NotificationModule {}
