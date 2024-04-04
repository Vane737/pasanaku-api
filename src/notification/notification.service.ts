import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { SendWhatsAppDto } from './dto/sendWhatsAppDto.dto';

@Injectable()
export class NotificationService {

    constructor() {      }

      async sendWhatsAppMessage(sendWhatsAppDto: SendWhatsAppDto): Promise<any> {
        try {
            const { nombre, email, numero } = sendWhatsAppDto;

            const body = `Hola ${nombre}, gracias por registrarte con el email ${email}..\n\n` + 
            `En este momento solo puedo enviar con el numero que te asigna twilio, todavia estoy viendo lo de Meta Bussiness:\n`;
            const from = 'whatsapp:';
            const to = `whatsapp:${numero}`;

            const message = await this.client.messages.create({ body, from, to });
          
             return message;
         } catch (error) {
          console.error('Error al enviar el mensaje de WhatsApp:', error);
          throw error;
        }
      }  
}
