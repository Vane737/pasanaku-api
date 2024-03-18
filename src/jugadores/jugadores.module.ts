import { Module } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { JugadoresController } from './jugadores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Jugador } from './entities/jugador.entity';

@Module({
  controllers: [JugadoresController],
  providers: [JugadoresService],
  imports: [
    TypeOrmModule.forFeature([ Jugador ])
  ]
})
export class JugadoresModule {}
