import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '../blog/entities/blog.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Blog])],
    controllers: [ReactionController],
    providers: [ReactionService],
})
export class ReactionModule {}
