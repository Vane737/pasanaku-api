import { Body, Controller, Post } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-invitacion.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  /*
  @Post()
  sendInviteMail(@Body() createEmailDto: CreateEmailDto) {
    return this.mailService.sendInviteMail(createEmailDto);
  }
  */
}

