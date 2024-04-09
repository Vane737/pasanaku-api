import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { CreateInvitacionDto } from './dto/create-invitacion.dto';
import { InvitacionService } from './invitacion.service';

@Controller('invitacion')
export class InvitacionController {

  constructor(private readonly invitacionService: InvitacionService) {}

  @Post()
  async create(@Body() createInvitacionDto: CreateInvitacionDto) {
    const invitacionCreado = await this.invitacionService.create(createInvitacionDto);
    return {
      status: 201,
      message: 'Invitacion creado exitosamente',
      data: invitacionCreado,
    };
  }

  
}
