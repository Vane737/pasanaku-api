import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';

import { JugadoresService } from 'src/jugadores/jugadores.service';

import { Participante } from 'src/participante/entities/participante.entity';
import { Transferencia } from './entities/transferencia.entity';
import { Ronda } from 'src/ronda/entities/ronda.entity';

@Injectable()
export class TransferenciaService {
    private readonly logger = new Logger('TransferenciaService') 

    constructor( 
        @InjectRepository( Ronda ) private readonly rondaRepository: Repository<Ronda>,
        @InjectRepository( Participante ) private readonly participanteRepository: Repository<Participante>, 
        @InjectRepository( Transferencia ) private readonly transferenciaRepository: Repository<Transferencia>,
        private readonly jugadoresService: JugadoresService,
    ) { }

    async create (ganador: Participante, deudor: Participante, ronda: Ronda): Promise<any>{
        var fecha = new Date();
        const transaccion = this.transferenciaRepository.create({ 
          monto: deudor.cuota,
          fecha: fecha,
          estado: 'Debe',
          ronda: ronda,
          deudor: deudor,
          receptor: ganador,
        }); 
        await this.transferenciaRepository.save(transaccion);
    }

    //Devuelve transferencias de un jugador
    async transferencias(id: number, req: Request) {
        const transferencias = await this.transferenciaRepository.find({ 
          where: {
            deudor: { jugador: { id: id } },
          },
          relations: ['ronda.partida','deudor.jugador','receptor.jugador'],
        });   
        const transferenciasSimples = await Promise.all(transferencias.map(async (transferencia) => ({          
          id: transferencia.id,
          monto: transferencia.monto,
          fecha: transferencia.fecha,
          estado: transferencia.estado,
          partida: transferencia.ronda.partida.nombre,
          ronda: transferencia.ronda.nombre,
          deudor: {
            id: transferencia.deudor.jugador.id,
            nombre: transferencia.deudor.jugador.nombre,
          },
          receptor: {
            id: transferencia.receptor.jugador.id,
            nombre: transferencia.receptor.jugador.nombre,
            imagen : await this.jugadoresService.obtenerImagen(transferencia.receptor.jugador.id,req),
          },
        })));
      return transferenciasSimples;
    }
    

    async pagar(id: number) {
      const transferencia = await this.transferenciaRepository.findOne({
          where: { id: id },
        });      
      
      transferencia.estado = 'Pagada';
      await this.transferenciaRepository.save(transferencia);   
      return 'Pagada';
  }
}
