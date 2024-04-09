import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Invitacion } from './entities/invitacion.entity';
import { Participante } from 'src/participante/entities/participante.entity';
import { Jugador } from 'src/jugadores/entities/jugador.entity';
import { CreateInvitacionDto } from './dto/create-invitacion.dto';



@Injectable()
export class InvitacionService {

    private readonly logger = new Logger('InvitacionService') 
    constructor( 
        @InjectRepository( Invitacion ) private readonly invitacionRepository: Repository<Invitacion>, 
        @InjectRepository( Jugador ) private readonly jugadorRepository: Repository<Jugador>, 
        @InjectRepository( Participante ) private readonly participanteRepository: Repository<Participante>, 
    ) { }

    async create(createInvitacionDto: CreateInvitacionDto): Promise<Invitacion> {
        this.logger.log('Iniciando el método create()...');
        const { participanteId, ...rest } = createInvitacionDto;
        var [participante] = await Promise.all([
            this.participanteRepository.findOneBy({ id: participanteId }),
        ]);
        if (!participante) {
            throw new NotFoundException('El participante especificada no existe');
        }  
        const partida = participante.partida;
        const invitacion = this.invitacionRepository.create({
            participante,
            partidaId: partida.id,
            ...rest,
          });
        return await this.invitacionRepository.save(invitacion);

    }


    async getInvitados(id: number) {
        const invitados = await this.invitacionRepository.find({
            where: { partidaId: id },
            select: ['id', 'nombre', 'telefono', 'email', 'estado', 'partidaId'],
          });                  
        return invitados;
    }


}
