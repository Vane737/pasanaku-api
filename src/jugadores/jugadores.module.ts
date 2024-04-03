import { Module } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { JugadoresController } from './jugadores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Jugador } from './entities/jugador.entity';
import { Cuenta } from 'src/cuenta/entities/cuenta.entity';
import { Participante } from 'src/participante/entities/participante.entity';

@Module({
  controllers: [JugadoresController],
  providers: [JugadoresService],
  imports: [
    TypeOrmModule.forFeature([ Jugador, Cuenta, Participante ])
  ]
})
export class JugadoresModule {}
