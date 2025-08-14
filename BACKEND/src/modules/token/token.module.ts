import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';

@Global() // 👈 makes the module available everywhere
@Module({
  imports: [TypeOrmModule.forFeature([Token])], // only Token entity
  exports: [TypeOrmModule], // export it so other modules can inject
})
export class TokenRepoModule {}
