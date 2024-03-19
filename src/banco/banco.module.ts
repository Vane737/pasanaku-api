import { Module } from '@nestjs/common';
import { BancoService } from './banco.service';
import { BancoController } from './banco.controller';
import { Banco } from './entities/banco.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [BancoController],
  providers: [BancoService],
  imports: [
    TypeOrmModule.forFeature([ Banco ])
  ]
})
export class BancoModule {}
