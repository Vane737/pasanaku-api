import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Partida } from 'src/partida/entities/partida.entity';
import { Jugador } from 'src/jugadores/entities/jugador.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Cuenta } from 'src/cuenta/entities/cuenta.entity';
import { Participante } from './entities/participante.entity';
import { CreateParticipanteDto } from './dto/create-participante.dto';

@Injectable()
export class ParticipanteService {

    private readonly logger = new Logger('PartidaService') 

    constructor( 
        @InjectRepository( Partida ) private readonly partidaRepository: Repository<Partida>, 
        @InjectRepository( Jugador ) private readonly jugadorRepository: Repository<Jugador>, 
        @InjectRepository( Role ) private readonly roleRepository: Repository<Role>, 
        @InjectRepository( Cuenta ) private readonly cuentaRepository: Repository<Cuenta>, 
        @InjectRepository( Participante ) private readonly participanteRepository: Repository<Participante>, 
    ) { }

    async create(createParticipanteDto: CreateParticipanteDto): Promise<Participante> {
        this.logger.log('Iniciando el método create()...');
        const { partidaId, jugadorId, cuentaId, rolId, ...rest } = createParticipanteDto;
        const [partida, jugador, cuenta, rol] = await Promise.all([
            this.partidaRepository.findOneBy({ id: partidaId }),
            this.jugadorRepository.findOneBy({ id: jugadorId }),
            this.cuentaRepository.findOneBy({ id: cuentaId }),
            this.roleRepository.findOneBy({ id: rolId }),
        ]);
        this.logger.log('Iniciando el método create()...');
        if (!jugador) {
            throw new NotFoundException('El jugador especificada no existe');
        }
        if (!partida) {
            throw new NotFoundException('El partida especificada no existe');
        }
        if (!cuenta) {
            throw new NotFoundException('El cuenta especificada no existe');
        }

        const participante = this.participanteRepository.create({
            partida,
            jugador,
            cuenta,
            rol,
            ...rest,
          });

        return await this.participanteRepository.save(participante);
    }

        
    findAll() {
        return this.participanteRepository.find({});
    }

}
