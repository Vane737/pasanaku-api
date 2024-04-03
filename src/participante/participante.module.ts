import { Module } from '@nestjs/common';
import { ParticipanteService } from './participante.service';
import { ParticipanteController } from './participante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Participante } from './entities/participante.entity';
import { Partida } from 'src/partida/entities/partida.entity';
import { Jugador } from 'src/jugadores/entities/jugador.entity';
import { Cuenta } from 'src/cuenta/entities/cuenta.entity';
import { Role } from 'src/roles/entities/role.entity';


@Module({
  providers: [ParticipanteService],
  controllers: [ParticipanteController],
  imports: [
    TypeOrmModule.forFeature([Participante, Partida, Jugador, Cuenta, Role]), // Importa las entidades Moneda y Partida
  ],
})
export class ParticipanteModule {}
