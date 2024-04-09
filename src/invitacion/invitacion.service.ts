import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Invitacion } from './entities/invitacion.entity';
import { Participante } from 'src/participante/entities/participante.entity';
import { Jugador } from 'src/jugadores/entities/jugador.entity';
import { CreateInvitacionDto } from './dto/create-invitacion.dto';
import { NotificationService } from 'src/notification/notification.service';
import { MailService } from 'src/mail/mail.service';



@Injectable()
export class InvitacionService {

    private readonly logger = new Logger('InvitacionService') 
    constructor( 
        @InjectRepository( Invitacion ) private readonly invitacionRepository: Repository<Invitacion>, 
        @InjectRepository( Jugador ) private readonly jugadorRepository: Repository<Jugador>, 
        @InjectRepository( Participante ) private readonly participanteRepository: Repository<Participante>, 
        private readonly notificationService: NotificationService,
        private readonly mailService: MailService,
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


    async enviarTodos(id: number) {
        const invitados = await this.invitacionRepository.createQueryBuilder("invitacion")
            .select("invitacion.id")
            .where("invitacion.partidaId = :id", { id })
            .andWhere("invitacion.estado = :estado", { estado: 'Espera' })
            .getMany();

        const respuestas = [];    
        for (const invitado of invitados) {
            const respuesta = await this.enviar(invitado.id);
            respuestas.push(respuesta);
        }
        return respuestas;
    }

    async enviar(id: number) {
        const invitado = await this.invitacionRepository.find({
            where: { id: id },
            relations: ['participante', 'participante.jugador'],
            select: ['id', 'nombre', 'telefono', 'email', 'estado', 'partidaId'],
        }); 

        const nombre = invitado[0].participante.jugador.nombre;
        const invitacion = invitado[0];
        const partida = invitado[0].participante.partida;
            
        const send1 = await this.notificationService.sendWhatsAppMessage(nombre,invitacion,partida);
        const send2 = await this.mailService.sendInviteMail(nombre,invitacion,partida);

        console.log(send1);
        console.log(send2);

        if(send1 == 'success' && send2 == 'success'){
            invitado[0].estado = 'Enviada';
            await this.invitacionRepository.save(invitado[0]); 
            return 'success';
        }else{
            return 'fail';
        }
        
    }

}
