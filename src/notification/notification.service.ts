import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Twilio } from 'twilio';
import * as admin from 'firebase-admin';

import { Repository } from 'typeorm';
import { JugadoresService } from 'src/jugadores/jugadores.service';
import { Invitacion } from 'src/invitacion/entities/invitacion.entity';
import { Partida } from 'src/partida/entities/partida.entity';
import { Jugador } from 'src/jugadores/entities/jugador.entity';

import { SendWhatsAppDto } from './dto/sendWhatsAppDto.dto';
import { join } from 'path';

@Injectable()
export class NotificationService {
    private readonly client: Twilio;
    constructor(
        @InjectRepository( Invitacion ) private readonly invitacionRepository: Repository<Invitacion>, 
        @InjectRepository( Jugador ) private readonly jugadorRepository: Repository<Jugador>, 
        private readonly jugadoresService: JugadoresService,
    ) {       
      const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      const accountSid = process.env.TWI_SID;
      const authToken = process.env.TWI_AUT;
        this.client = require('twilio')(accountSid, authToken);
      }
      

      
      async sendWhatsAppMessage(nombre: string,invitacion: Invitacion,partida: Partida): Promise<any> {
        try {
          const mediaUrl = ['https://i.ibb.co/1R2Cn8h/qr.png'];
          const body = `Hola ${invitacion.nombre}.` + 
          `A sido invitado a la partida ${partida.nombre}, con un monto de ${partida.pozo}\n` + 
          `por el jugador ${nombre}\n\n` + 
          `La partida empieza el ${partida.fechaInicio}\n`;
  
          const from = 'whatsapp:+14155238886';
          const to = `whatsapp:+591${invitacion.telefono}`;

          const message = await this.client.messages.create({ body, from, to, mediaUrl});

          console.log('Mensage enviado correctamente a ' + invitacion.nombre);
          return 'success';
  
          } catch (error) {
            console.error('Error al enviar el mensaje de WhatsApp:', error);
            throw error;
          }
      }

      async sendPushNotificationPrueba (id: number): Promise<any> {
        const jugador = await this.jugadorRepository.findOne({
          where: { id: id }
        });        
        const message = {
          notification: {
            title: "Nueva oferta",
            body: "Hay una nueva oferta disponible, toca para verla.",
          },          
          token: jugador.tokenMovil,
        };    
        try {
          const response = await admin.messaging().send(message);
          console.log('Successfully sent message:', response);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }


      async sendPushNotificationInvitacion (token: string, title: string, body : string): Promise<any> { 
        const message = {
          notification: {
            title: title,
            body: body,
          },          
          token: token,
        };    
        try {
          const response = await admin.messaging().send(message);
          console.log('Successfully sent message:', response);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }

      async sendPushNotification (id: number, title: string, body : string): Promise<any> { 
        
        var tokens: string[] = await this.jugadoresService.tokens(id);
        
        const message = {
          notification: {
            title: title,
            body: body,
          },          
          tokens: tokens,
        };    
        try {
          const response = await admin.messaging().sendMulticast(message);
          console.log('Successfully sent message:', response);
        } catch (error) {
          console.error('Error sending message:', error);
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
