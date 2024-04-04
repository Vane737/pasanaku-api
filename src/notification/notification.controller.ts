import { Controller, Post,Body } from '@nestjs/common';
import { SendWhatsAppDto } from './dto/sendWhatsAppDto.dto';
//import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

 @Post('send')
  async sendWhatsAppMessage(@Body() sendWhatsAppDto: SendWhatsAppDto) {
        // Enviar el mensaje de WhatsApp
    return this.notificationService.sendWhatsAppMessage(sendWhatsAppDto);
  }

}
