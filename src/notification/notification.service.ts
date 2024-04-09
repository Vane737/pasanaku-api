import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Twilio } from 'twilio';

import { Repository } from 'typeorm';
import { Invitacion } from 'src/invitacion/entities/invitacion.entity';
import { Partida } from 'src/partida/entities/partida.entity';

import { SendWhatsAppDto } from './dto/sendWhatsAppDto.dto';

@Injectable()
export class NotificationService {
    private readonly client: Twilio;
    constructor(
        @InjectRepository( Invitacion ) private readonly invitacionRepository: Repository<Invitacion>, 
    ) {        
      const accountSid = process.env.TWI_SID;
      const authToken = process.env.TWI_AUT;
        this.client = require('twilio')(accountSid, authToken);
      }
      
      async sendWhatsAppMessage(nombre: string,invitacion: Invitacion,partida: Partida): Promise<any> {
        try {
          const body = `Hola ${invitacion.nombre}.\n\n` + 
          `A sido invitado a la partida ${partida.nombre}, con un monto de ${partida.pozo}\n` + 
          `por el jugador ${nombre}\n\n` + 
          `La partida empieza el ${partida.fechaInicio}\n`;
  
          const from = 'whatsapp:+14155238886';
          const to = `whatsapp:+591${invitacion.telefono}`;
          const message = await this.client.messages.create({ body, from, to });

          console.log('Mensage enviado correctamente a' + invitacion.nombre);
          return 'success';
  
          } catch (error) {
            console.error('Error al enviar el mensaje de WhatsApp:', error);
            throw error;
          }
      }

      /*
      //Prueba Twillio
      async sendWhatsAppMessage(id: number): Promise<any> {
        try {
            const  nombre = "juan";
            const body = `Hola ${nombre}, gracias por registrarte con el email..\n\n` + 
            `En este momento solo puedo enviar con el numero que te asigna twilio, todavia estoy viendo lo de Meta Bussiness:\n`;
            const from = 'whatsapp:+14155238886';
            const to = `whatsapp:+59170872473`;

            const message = await this.client.messages.create({ body, from, to });
          
             return message;
         } catch (error) {
          console.error('Error al enviar el mensaje de WhatsApp:', error);
          throw error;
        }
      } 
      */
     
    /*
    //Pruebaa envio directo
      async sendWhatsAppMessage(id: number): Promise<any> {
      try {
        console.log('service');
        const invitado = await this.invitacionRepository.find({
          where: { id: id },
          relations: ['participante', 'participante.jugador'],
          select: ['id', 'nombre', 'telefono', 'email', 'estado', 'partidaId'],
          }); 
          console.log(invitado[0].participante.jugador.nombre);

          const nombre = invitado[0].participante.jugador.nombre;
          const partida = invitado[0].participante.partida;

          const body = `Hola ${invitado[0].nombre}..\n\n` + 
          `A sido invitado a la partida ${partida.nombre}, con un monto de ${partida.pozo}\n` + 
          `por el jugador ${nombre}\n\n` + 
          `La partida empieza el ${partida.fechaInicio}\n`;

          const from = 'whatsapp:+14155238886';
          const to = `whatsapp:+591${invitado[0].telefono}`;
          const message = await this.client.messages.create({ body, from, to });
          return invitado;

        } catch (error) {
          console.error('Error al enviar el mensaje de WhatsApp:', error);
          throw error;
        }
    }
    */
   

    
}
