import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Moneda } from 'src/moneda/entities/moneda.entity';
import { Partida } from './entities/partida.entity';

import { CreatePartidaDto } from './dto/create-partida.dto';
import { RondaService } from 'src/ronda/ronda.service';
import { fromZonedTime   } from 'date-fns-tz';

@Injectable()
export class PartidaService {

    private readonly logger = new Logger('PartidaService') 

    constructor( 
        @InjectRepository( Partida ) 
        private readonly partidaRepository: Repository<Partida>, 
        
        @InjectRepository( Moneda ) 
        private readonly monedaRepository: Repository<Moneda>, 

        private readonly rondaService: RondaService,
        ) { }


    async create(createPartidaDto: CreatePartidaDto): Promise<Partida> {
        console.log("hola");
        const moneda = await this.monedaRepository.findOneBy({ id: createPartidaDto.monedaId });
        if (!moneda) {
            throw new NotFoundException('La moneda especificada no existe');
        }

        createPartidaDto.pozo = createPartidaDto.participantes * createPartidaDto.coutaInicial;

        const partida = this.partidaRepository.create({ 
         ...createPartidaDto,      
        moneda
        });
        return await this.partidaRepository.save(partida);
    }


    findAll() {
        return this.partidaRepository.find({});
    }    
    
    
    async findOne(id: number) {
        const partida = await this.partidaRepository.findOneBy({ id });
        if ( !partida ) {
          throw new NotFoundException(`La partida con el id ${ id } no fue encontrado.`)
        }
        console.log(partida);
        return partida;
    }


    async remove(id: number) {
        const partida = await this.findOne(id);
        await this.partidaRepository.remove( partida );
    }


    async iniciarPartida(id: number) {
        const partida = await this.partidaRepository.findOne({
            relations: ['participantesEnPartida','participantesEnPartida.jugador'],
            where: { id: id },
          });      
        if ( !partida ) {
            throw new NotFoundException(`La partida con el id ${ id } no fue encontrado.`)
        }  
        if(partida.participantesEnPartida.length < 2){
            return 'Necesitas mas de 2 participantes' 
        }
        const ahora = new Date();

        partida.participantes = partida.participantesEnPartida.length;
        partida.pozo = (partida.participantes * partida.coutaInicial);
        partida.fechaInicio = ahora;
        partida.estado = 'Iniciada';
        await this.partidaRepository.save(partida);

        await this.rondaService.create(partida);

        return partida
    }
    
}
