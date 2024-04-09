import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { LoginJugadorDto } from './dto/login-jugador.dto';

@Controller('jugadores')
export class JugadoresController {

  constructor(private readonly jugadoresService: JugadoresService) {}

  @Post('register')
  async create(@Body() createJugadorDto: CreateJugadorDto) {
    console.log('Datos recibidos en el cuerpo de la solicitud:', createJugadorDto);
    const jugadorCreado = await this.jugadoresService.create(createJugadorDto);
    return {
      status: 201,
      message: 'Jugador creado exitosamente',
      data: jugadorCreado,
    };
  }

  @Post('login')
  async loginPlayer(@Body() loginJugadorDto: LoginJugadorDto) {
    const jugadorLogueado = await this.jugadoresService.login(loginJugadorDto);
    return {
      status: 201,
      message: 'Jugador logueado exitosamente',
      data: jugadorLogueado,
    };
    
  }


  @Get()
  async findAll() {
    const jugadores = await this.jugadoresService.findAll();
    return {
      status: 200,
      message: 'Jugadores obtenidos exitosamente',
      data: jugadores,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
      await this.jugadoresService.remove(+id);
      return {
        status: 200,
        message: 'Jugador eliminado exitosamente',
      };
  }
  
  @Get(':id')
  async findOne(@Param('id') id: number) {
      const jugador = await this.jugadoresService.findOne(+id);
      return {
        status: 200,
        message: 'Jugador encontrado exitosamente',
        data: jugador,
      };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number, 
    @Body() updateJugadorDto: UpdateJugadorDto
  ) {
    const jugadorActualizado = await this.jugadoresService.update(+id, updateJugadorDto);
    return {
      status: 200,
      message: 'Jugador actualizado exitosamente',
      data: jugadorActualizado,
      };    
  }

  @Get(':id/participaciones')
  async getParticipaciones(@Param('id') id: number) {
    const participaciones = await this.jugadoresService.getParticipaciones(id);
    console.log(participaciones);
    return {
      status: 200,
      message: 'Participaciones del jugador conseguidas exitosamente',
      data: participaciones,
     };
  }
  
  
}
