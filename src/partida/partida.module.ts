import { Module } from '@nestjs/common';
import { PartidaController } from './partida.controller';
import { PartidaService } from './partida.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Partida } from './entities/partida.entity';
import { Moneda } from 'src/moneda/entities/moneda.entity';
import { Participante } from 'src/participante/entities/participante.entity';

@Module({
  controllers: [PartidaController],
  providers: [PartidaService],
  imports: [
    TypeOrmModule.forFeature([Partida,Moneda,Participante])
  ]
})
export class PartidaModule {}
