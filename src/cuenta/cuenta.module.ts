import { Module } from '@nestjs/common';
import { CuentaService } from './cuenta.service';
import { CuentaController } from './cuenta.controller';
import { Cuenta } from './entities/cuenta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jugador } from '../jugadores/entities/jugador.entity';
import { Banco } from 'src/banco/entities/banco.entity';

@Module({
  controllers: [CuentaController],
  providers: [CuentaService],
  imports: [
    TypeOrmModule.forFeature([ Jugador, Cuenta, Banco ])
  ]
})
export class CuentaModule {}
