import { forwardRef, Module } from '@nestjs/common';
import { PartidaController } from './partida.controller';
import { PartidaService } from './partida.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipanteModule } from 'src/participante/participante.module';
import { InvitacionModule } from 'src/invitacion/invitacion.module';
import { RondaModule } from 'src/ronda/ronda.module';
import { NotificationModule } from 'src/notification/notification.module';


import { Partida } from './entities/partida.entity';
import { Moneda } from 'src/moneda/entities/moneda.entity';
import { Participante } from 'src/participante/entities/participante.entity';
import { Ronda } from 'src/ronda/entities/ronda.entity';


@Module({
  controllers: [PartidaController],
  providers: [PartidaService],
  imports: [
    ParticipanteModule,
    InvitacionModule,
    forwardRef(() => RondaModule),
    NotificationModule,
    TypeOrmModule.forFeature([Partida,Moneda,Participante,Ronda])
    
  ],
  exports: [PartidaService],
})
export class PartidaModule {}
