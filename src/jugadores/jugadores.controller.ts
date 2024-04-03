import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';

@Controller('jugadores')
export class JugadoresController {

  constructor(private readonly jugadoresService: JugadoresService) {}

  @Post()
  create(@Body() createJugadorDto: CreateJugadorDto) {
    return this.jugadoresService.create( createJugadorDto );
  }

  @Get()
  findAll() {
    return this.jugadoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jugadoresService.findOne( id );
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateJugadorDto: UpdateJugadorDto) {
    return this.jugadoresService.update( id, updateJugadorDto );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jugadoresService.remove( id );
  }
  
}
