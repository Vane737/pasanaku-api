import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Invitacion } from 'src/invitacion/entities/invitacion.entity';
import { Participante } from 'src/participante/entities/participante.entity';
import { CreateEmailDto } from './dto/create-invitacion.dto';
import path from 'path';
import { Partida } from 'src/partida/entities/partida.entity';

@Injectable()
export class MailService {

    constructor(
        @InjectRepository( Invitacion ) private readonly invitacionRepository: Repository<Invitacion>, 
        @InjectRepository( Participante ) private readonly participanteRepository: Repository<Participante>, 
        private mailerService: MailerService,
    ) { }


    async sendInviteMail(nombre: string,invitacion: Invitacion,partida: Partida) {
        try {
        await this.mailerService.sendMail({
            to: invitacion.email,
            subject: 'Invitación a nueva Partida',
            template: './invitacion',
            context: {
                event: partida.nombre,
                invitado: invitacion.nombre,
                jugador: nombre,
                monto: partida.pozo,
                cant: partida.participantes,
            },
        });
        console.log("Correo enviado correctamente" + invitacion.nombre);
        return 'success';

        } catch (error) {
            console.error("Error al enviar el correo:", error);
        }
        
    }

    /*
    //Pruebaa envio directo
    async sendInviteMail(createEmailDto: CreateEmailDto) {
        const { invitacionId } = createEmailDto;
        console.log(invitacionId);
        var [invitacion] = await Promise.all([
            this.invitacionRepository.findOneBy({ id: invitacionId }),
        ]);       
        var partida = invitacion.participante.partida;
        try {
        await this.mailerService.sendMail({
            to: invitacion.email,
            subject: 'Invitación a nueva Partida',
            template: './invitacion',
            context: {
                event: partida.nombre,
                player: invitacion.nombre,
                monto: partida.pozo,
                cant: partida.participantes,
            },
        });
        console.log("Correo enviado correctamente");
        } catch (error) {
            console.error("Error al enviar el correo:", error);
        }

      return 'Email sent';
    }
    */
}
