import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitacion } from 'src/invitacion/entities/invitacion.entity';
import { Partida } from 'src/partida/entities/partida.entity';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [
    TypeOrmModule.forFeature([Invitacion,Partida])    
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
