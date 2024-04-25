import { Module } from '@nestjs/common';
import { SubastaController } from './subasta.controller';
import { SubastaService } from './subasta.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from 'src/notification/notification.module';

import { Ronda } from 'src/ronda/entities/ronda.entity';
import { Subasta } from './entities/subasta.entity';
import { Oferta } from 'src/oferta/entities/oferta.entity';


@Module({
  controllers: [SubastaController],
  providers: [SubastaService],
  imports: [
    NotificationModule,
    TypeOrmModule.forFeature([Ronda,Subasta,Oferta])
    
  ],
  exports: [SubastaService],
})
export class SubastaModule {}
