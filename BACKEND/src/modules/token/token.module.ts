import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Token])],
    exports: [TypeOrmModule]
})
export class TokenRepoModule {}
