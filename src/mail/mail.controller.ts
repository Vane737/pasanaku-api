import { Body, Controller, Get, Post, Put } from '@nestjs/common';
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

  @Get('hola')
  hola() {

    const files = 'hola'; 
    console.log(files)
    return files;
  }

  @Get('imagenes')
  getFiles() {
    const assetsPath = join(__dirname, '..', '..','assets/qr');
    console.log(assetsPath)
    const files = readdirSync(assetsPath); 
    console.log(files)
    return assetsPath;
  }

  @Post('img')
  getFiles2() {
    const assetsPath = join(__dirname, '..', '..','assets/qr');
    console.log(assetsPath)
    const files = readdirSync(assetsPath); 
    console.log(files)
    return files;
  }

  @Put('qr')
  getFiles1() {
    const assetsPath = join(__dirname, '..', '..','assets/qr');
    console.log(assetsPath)
    const files = readdirSync(assetsPath); 
    console.log(files)
    return files;
  }
}

