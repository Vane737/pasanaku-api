import { Module } from '@nestjs/common';
import { Transferencia } from './entities/transferencia.entity';
import { TransferenciaController } from './transferencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Participante } from 'src/participante/entities/participante.entity';
import { Ronda } from 'src/ronda/entities/ronda.entity';
import { TransferenciaService } from './transferencia.service';

@Module({
  controllers: [TransferenciaController],
  providers: [TransferenciaService],
  imports: [
    TypeOrmModule.forFeature([Transferencia,Participante,Ronda])
    
  ],
  exports: [TransferenciaService],
})
export class TransferenciaModule {}
