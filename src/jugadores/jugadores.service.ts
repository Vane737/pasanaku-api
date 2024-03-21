import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Jugador } from './entities/jugador.entity';
import { CuentaService } from 'src/cuenta/cuenta.service';
import { Cuenta } from 'src/cuenta/entities/cuenta.entity';

@Injectable()
export class JugadoresService {

  private readonly logger = new Logger('JugadoresService')

  constructor( 
    @InjectRepository( Jugador ) 
    private readonly jugadorRepository: Repository<Jugador>, 
    
    @InjectRepository( Cuenta ) 
    private readonly cuentaRepository: Repository<Cuenta>, 
    ) { }

  async create(createJugadorDto: CreateJugadorDto) {

    try {
      const { cuentas = [], ...jugadorDetails } = createJugadorDto;
      const jugador = this.jugadorRepository.create({ 
        ...jugadorDetails, 
        cuentas: cuentas.map( cuenta => this.cuentaRepository.create({ nro: cuenta.nro, departamento: cuenta.departamento }) ) 
      });
      await this.jugadorRepository.save( jugador );
 
      return { ...jugador, cuentas };

    } catch (error) {      
      console.log(error);
      this.handleExceptions( error ); 
    }
  }


  findAll() {
    return this.jugadorRepository.find({
      relations: {
        cuentas: true,
      }
    });

  }


  async findOne( id: string ) {
    const jugador = await this.jugadorRepository.findOneBy({ id });
    if ( !jugador ) {
      throw new NotFoundException(`El jugador con el id ${ id } no fue encontrado.`)
    }
    return jugador;
  }


  async update( id: string, updateJugadorDto: UpdateJugadorDto ): Promise<Jugador> {
    // Busca al jugador existente por su ID
    const { cuentas, ...jugadorDto } = await this.jugadorRepository.findOneBy({ id });

    console.log(jugadorDto);
    
    if (!jugadorDto) {
      throw new NotFoundException(`Jugador con el id ${id} no encontrado`);
    }

    // Actualiza las propiedades del jugador según el DTO
    if ( updateJugadorDto.nombre ) {
      jugadorDto.nombre = updateJugadorDto.nombre;
    }
    if ( updateJugadorDto.telefono ) {
      jugadorDto.telefono =  updateJugadorDto.telefono;
    }
    if ( updateJugadorDto.email ) {
      jugadorDto.email =  updateJugadorDto.email;
    }
    if ( updateJugadorDto.ci ) {
      jugadorDto.ci =  updateJugadorDto.ci;
    }
    if ( updateJugadorDto.email ) {
      jugadorDto.email =  updateJugadorDto.email;
    }
    if ( updateJugadorDto.direccion ) {
      jugadorDto.direccion =  updateJugadorDto.direccion;
    }
    if ( updateJugadorDto.cuentas ) {
      await this.jugadorRepository.save({ cuentas, ...jugadorDto });
    } else {
      
      await this.jugadorRepository.save({ cuentas: [], ...jugadorDto });
    }

    // jugadorDto.cuentas = [];

    // Guarda el jugadorDto actualizado
    await console.log(jugadorDto)
    await this.jugadorRepository.save({ cuentas, ...jugadorDto });

    return await this.jugadorRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const jugador = await this.findOne(id);

    await this.jugadorRepository.remove( jugador );
  }

  async deleteAllJugadores() {
    const query = this.jugadorRepository.createQueryBuilder('jugador');

    try {
      return await query
      .delete()
      .where({})
      .execute();
    } catch ( error ) {
      this.handleExceptions(error)
      
    }
  }

  private handleExceptions( error: any) {
    if( error.code === '23505')
      throw new BadRequestException( error.detail );

    this.logger.error( error )

    throw new InternalServerErrorException('Error al conectar al servidor')
    
  }
}
