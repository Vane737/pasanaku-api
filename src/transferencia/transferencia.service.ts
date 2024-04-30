import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    ) { }

    async create (ganador: Participante, deudor: Participante, ronda: Ronda): Promise<any>{
        var fecha = new Date();
        const transaccion = this.transferenciaRepository.create({ 
          monto: deudor.cuota,
          fecha: fecha,
          estado: 'Debe',
          ronda:ronda,
          deudor: deudor,
          receptor: ganador,
        }); 
        await this.transferenciaRepository.save(transaccion);
    }

    //Devuelve transferencias de un jugador
    async transferencias(id: number) {
        const transferencias = await this.transferenciaRepository.find({ 
          where: {
            deudor: { jugador: { id: id } },
          },
        });   
        return transferencias;
    }
    
}
