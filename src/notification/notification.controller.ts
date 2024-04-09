import { Controller, Post,Body } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators/http';
import { SendWhatsAppDto } from './dto/sendWhatsAppDto.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

  /*
  @Post('send/:id')
  async sendWhatsAppMessage(@Param('id') id: number) {
        // Enviar el mensaje de WhatsApp
    return this.notificationService.sendWhatsAppMessage(id);
  }
  */
 
  /*
  @Post('enviar/:id')
  sendInviteMail(@Param('id') id: number) {
    console.log('service');
    return this.notificationService.sendWhatsAppMessage(id);
  }
  */
 
}
