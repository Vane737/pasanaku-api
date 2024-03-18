import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Jugador } from './entities/jugador.entity';

@Injectable()
export class JugadoresService {

  private readonly logger = new Logger('JugadoresService')

  constructor( @InjectRepository( Jugador ) private readonly jugadorRepository: Repository<Jugador>, ) { }


  async create(createJugadorDto: CreateJugadorDto) {

    try {
      const jugador = this.jugadorRepository.create( createJugadorDto );
      await this.jugadorRepository.save( jugador );

      return jugador;

    } catch (error) {      
      console.log(error);
      this.handleExceptions( error ); 
    }
  }


  findAll() {
    return this.jugadorRepository.find({});
  }


  async findOne(id: string) {
    const jugador = await this.jugadorRepository.findOneBy({ id });
    if ( !jugador ) {
      throw new NotFoundException(`El jugador con el id ${ id } no fue encontrado.`)
    }
    return jugador;
  }


  async update(id: string, updateJugadorDto: UpdateJugadorDto): Promise<Jugador> {
    // Busca al jugador existente por su ID
    const jugador = await this.jugadorRepository.findOneBy({ id });

    console.log(jugador);
    
    if (!jugador) {
      throw new NotFoundException(`Jugador con el id ${id} no encontrado`);
    }

    // Actualiza las propiedades del jugador según el DTO
    if (updateJugadorDto.nombre) {
      jugador.nombre = updateJugadorDto.nombre;
    }
    if (updateJugadorDto.telefono) {
      jugador.telefono = updateJugadorDto.telefono;
    }
    if (updateJugadorDto.email) {
      jugador.email = updateJugadorDto.email;
    }
    if (updateJugadorDto.ci) {
      jugador.ci = updateJugadorDto.ci;
    }
    if (updateJugadorDto.email) {
      jugador.email = updateJugadorDto.email;
    }
    if (updateJugadorDto.direccion) {
      jugador.direccion = updateJugadorDto.direccion;
    }

    // Guarda el jugador actualizado
    await this.jugadorRepository.save(jugador);

    return jugador;
  }

  async remove(id: string) {
    const jugador = await this.findOne(id);
    // if( !jugador )

    await this.jugadorRepository.remove( jugador );
  }

  private handleExceptions( error: any) {
    if( error.code === '23505')
      throw new BadRequestException( error.detail );

    this.logger.error( error )

    throw new InternalServerErrorException('Error al conectar al servidor')
    
  }
}
