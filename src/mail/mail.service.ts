import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Invitacion } from 'src/invitacion/entities/invitacion.entity';
import { Participante } from 'src/participante/entities/participante.entity';
import { CreateEmailDto } from './dto/create-invitacion.dto';
import path from 'path';

@Injectable()
export class MailService {

    constructor(
        @InjectRepository( Invitacion ) private readonly invitacionRepository: Repository<Invitacion>, 
        @InjectRepository( Participante ) private readonly participanteRepository: Repository<Participante>, 
        private mailerService: MailerService,
    ) { }

    async sendInviteMail(createEmailDto: CreateEmailDto) {
        const { invitacionId } = createEmailDto;
        console.log(invitacionId);
        var [invitacion] = await Promise.all([
            this.invitacionRepository.findOneBy({ id: invitacionId }),
        ]);
        console.log(invitacion.email);
        
        var partida = invitacion.participante.partida;
        console.log(partida);

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
            // Aquí puedes realizar cualquier acción adicional o registrar el error según sea necesario
        }
      return 'Email sent';
    }
}
