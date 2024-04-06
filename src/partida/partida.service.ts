import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Moneda } from 'src/moneda/entities/moneda.entity';
import { Repository } from 'typeorm';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { Partida } from './entities/partida.entity';

@Injectable()
export class PartidaService {

    private readonly logger = new Logger('PartidaService') 

    constructor( 
        @InjectRepository( Partida ) 
        private readonly partidaRepository: Repository<Partida>, 
        
        @InjectRepository( Moneda ) 
        private readonly monedaRepository: Repository<Moneda>, 
        ) { }


    async create(createPartidaDto: CreatePartidaDto): Promise<Partida> {
        const moneda = await this.monedaRepository.findOneBy({ id: createPartidaDto.monedaId });
        if (!moneda) {
            throw new NotFoundException('La moneda especificada no existe');
        }
        const partida = this.partidaRepository.create({
        ...createPartidaDto,
        moneda,
        });

        return await this.partidaRepository.save(partida);

    }


    findAll() {
        return this.partidaRepository.find({});
    }    
    
    
    async findOne(id: number) {
        const moneda = await this.partidaRepository.findOneBy({ id });
        if ( !moneda ) {
          throw new NotFoundException(`La partida con el id ${ id } no fue encontrado.`)
        }
        return moneda;
    }


    async remove(id: number) {
        const partida = await this.findOne(id);
        await this.partidaRepository.remove( partida );
      }
}
