import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { SendWhatsAppDto } from './dto/sendWhatsAppDto.dto';

@Injectable()
export class NotificationService {

    private readonly client: Twilio;
    constructor() {
        const accountSid = 'AC68304aaa3eb229addaef404c43640a58';
        const authToken = 'd661fc336ae9625c04c5df7f8418dfd9';
        this.client = require('twilio')(accountSid, authToken);
      }

      async sendWhatsAppMessage(sendWhatsAppDto: SendWhatsAppDto): Promise<any> {
        try {
            const { nombre, email, numero } = sendWhatsAppDto;

            const body = `Hola ${nombre}, gracias por registrarte con el email ${email}..\n\n` + 
            `En este momento solo puedo enviar con el numero que te asigna twilio, todavia estoy viendo lo de Meta Bussiness:\n`;
            const from = 'whatsapp:+14155238886';
            const to = `whatsapp:${numero}`;

            const message = await this.client.messages.create({ body, from, to });
          
             return message;
         } catch (error) {
          console.error('Error al enviar el mensaje de WhatsApp:', error);
          throw error;
        }
      }  
}
