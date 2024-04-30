import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Jugador } from 'src/jugadores/entities/jugador.entity';
import { Participante } from 'src/participante/entities/participante.entity';
import { Subasta } from 'src/subasta/entities/subasta.entity';
import { Oferta } from './entities/oferta.entity';
import { CreateOfertaDto } from './dto/create-oferta.dto';


@Injectable()
export class OfertaService {
    private readonly logger = new Logger('InvitacionService') 
    constructor( 
        @InjectRepository( Subasta ) private readonly subastaRepository: Repository<Subasta>, 
        @InjectRepository( Jugador ) private readonly jugadorRepository: Repository<Jugador>, 
        @InjectRepository( Participante ) private readonly participanteRepository: Repository<Participante>, 
        @InjectRepository( Oferta ) private readonly ofertaRepository: Repository<Oferta>,
        
    ) { }

    async create(createOfertaDto: CreateOfertaDto) {
        this.logger.log('Iniciando el método create()...');
        
        const { subastaId, jugadorId, ...rest } = createOfertaDto;
        
        const subasta = await this.subastaRepository.findOne({
            relations: ['ronda','ronda.partida'],
            where: { id: subastaId },
          });

        if ( !subasta ) {
            throw new NotFoundException(`La subasta no fue encontrada.`)
        }  
        if ( subasta.estado != 'Iniciada' ) {
            return "No se puede ingresar pujas a esta subasta";
        }  

        const participante = await this.participanteRepository.findOne({
            relations: ['jugador'],
            where: {
                partida: { id: subasta.ronda.partida.id  },
                jugador: { id: jugadorId },
            },
          });
        if ( !participante ) {
            throw new NotFoundException(`El participante no fue encontrada.`)
        }  

        if( participante.recibido == true){
            return "No se puede realizar pujas ya fuiste el ganador en una subasta";
        }

        const ofertaRepetida = await this.ofertaRepository.findOne({
            where: {
                subasta: { id: subastaId },
                participante: { id: participante.id },
            },
          });

        if ( !ofertaRepetida ) {
            const ahora = new Date();
            const oferta = this.ofertaRepository.create({
                ...rest,
                fecha: ahora,
                subasta: subasta,
                participante: participante,
            });
            await this.ofertaRepository.save(oferta);
            return 'La oferta fue realiza exitosamente'
        }  

        return "Ya as realizado una puja en esta subasta";                

    }

        
}
