import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { ParticipanteService } from './participante.service';

@Controller('participante')
export class ParticipanteController {

   constructor(private readonly participanteService: ParticipanteService) {}

  
  @Post()
  create(@Body() createParticipanteDto: CreateParticipanteDto) {
    console.log('controller');
    return this.participanteService.create( createParticipanteDto );
  }

  @Get()
  findAll() {
    return this.participanteService.findAll();
  }

  @Get('creador/:id')
  async creador(@Param('id') id: number) {
      const participante = await this.participanteService.creador(id);
      return participante;
  }
  
  @Put('eliminar/:id')
  async eliminar(@Param('id') id: number) {
      const participante = await this.participanteService.eliminar(id);
      return participante;
  }

}
