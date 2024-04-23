import { Module } from '@nestjs/common';
import { RondaController } from './ronda.controller';
import { RondaService } from './ronda.service';

import { Ronda } from './entities/ronda.entity';
import { Partida } from 'src/partida/entities/partida.entity';
import { Subasta } from 'src/subasta/entities/subasta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubastaModule } from 'src/subasta/subasta.module';


@Module({
  controllers: [RondaController],
  providers: [RondaService],
  imports: [
    SubastaModule,
    TypeOrmModule.forFeature([Partida,Ronda,Subasta])
    
  ],
  exports: [RondaService],
})
export class RondaModule {}
