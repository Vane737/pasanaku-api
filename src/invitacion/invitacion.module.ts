import { Module } from '@nestjs/common';
import { InvitacionController } from './invitacion.controller';
import { InvitacionService } from './invitacion.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitacion } from './entities/invitacion.entity';
import { Participante } from 'src/participante/entities/participante.entity';
import { Jugador } from 'src/jugadores/entities/jugador.entity';


@Module({
  controllers: [InvitacionController],
  providers: [InvitacionService],
  imports: [
    TypeOrmModule.forFeature([ Jugador, Invitacion, Participante ])
  ],
  exports: [ TypeOrmModule ]

})
export class InvitacionModule {}
