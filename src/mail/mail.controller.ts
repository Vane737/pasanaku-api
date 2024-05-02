import { Body, Controller, Get, Post } from '@nestjs/common';
import { readdirSync } from 'fs';
import { join } from 'path';
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
  @Get('imagenes')
  getFiles() {
    const assetsPath = join(__dirname, '..', '..','assets/qr');
    console.log(assetsPath)
    const files = readdirSync(assetsPath); 
    console.log(files)
    return files;
  }
}

