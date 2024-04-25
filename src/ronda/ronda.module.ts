import { Module } from '@nestjs/common';
import { RondaController } from './ronda.controller';
import { RondaService } from './ronda.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { SubastaModule } from 'src/subasta/subasta.module';
import { NotificationModule } from 'src/notification/notification.module';

import { Ronda } from './entities/ronda.entity';
import { Partida } from 'src/partida/entities/partida.entity';
import { Subasta } from 'src/subasta/entities/subasta.entity';



@Module({
  controllers: [RondaController],
  providers: [RondaService],
  imports: [
    SubastaModule,
    NotificationModule,
    TypeOrmModule.forFeature([Partida,Ronda,Subasta])
    
  ],
  exports: [RondaService],
})
export class RondaModule {}
