import { Module } from '@nestjs/common';
import { PartidaController } from './partida.controller';
import { PartidaService } from './partida.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Partida } from './entities/partida.entity';
import { Moneda } from 'src/moneda/entities/moneda.entity';
import { Participante } from 'src/participante/entities/participante.entity';
import { ParticipanteModule } from 'src/participante/participante.module';
import { ParticipanteService } from 'src/participante/participante.service';

@Module({
  controllers: [PartidaController],
  providers: [PartidaService],
  imports: [
    ParticipanteModule,
    TypeOrmModule.forFeature([Partida,Moneda,Participante])
    
  ]
})
export class PartidaModule {}
