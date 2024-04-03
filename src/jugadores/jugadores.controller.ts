import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { JugadoresService } from './jugadores.service';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { BadRequestException, NotFoundException } from './exceptions/custom-exceptions';
import { LoginJugadorDto } from './dto/login-jugador.dto';

@Controller('jugadores')
export class JugadoresController {
  constructor(private readonly jugadoresService: JugadoresService) {}

  @Post('register')
  async create(@Body() createJugadorDto: CreateJugadorDto) {
    try {
      const jugadorCreado = await this.jugadoresService.create(createJugadorDto);
      return {
        status: 201,
        message: 'Jugador creado exitosamente',
        data: jugadorCreado,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        return {
          status: 400,
          message: error.message,
          error_code: 'BAD_REQUEST',
        };
      } else if (error instanceof NotFoundException) {
        return {
          status: 404,
          message: error.message,
          error_code: 'NOT_FOUND',
        };
      } else {
        return {
          status: 500,
          message: 'Error interno del servidor',
          error_code: 'INTERNAL_SERVER_ERROR',
        };
      }
    }
  }

  @Post('login')
  async loginPlayer(@Body() loginJugadorDto: LoginJugadorDto) {
    try {
      const jugadorLogueado = await this.jugadoresService.login(loginJugadorDto);
      return {
        status: 201,
        message: 'Jugador logueado exitosamente',
        data: jugadorLogueado,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) { // Aquí se maneja la excepción UnauthorizedException
        return {
          status: 401,
          message: error.message,
          error_code: 'UNAUTHORIZED',
        };
      } else if (error instanceof BadRequestException) {
        return {
          status: 400,
          message: error.message,
          error_code: 'BAD_REQUEST',
        };
      } else if (error instanceof NotFoundException) {
        return {
          status: 404,
          message: error.message,
          error_code: 'NOT_FOUND',
        };
      } else {
        return {
          status: 500,
          message: 'Error interno del servidor',
          error_code: 'INTERNAL_SERVER_ERROR',
        };
      }
    }
  }


  @Get()
  async findAll() {
    try {
      const jugadores = await this.jugadoresService.findAll();
      return {
        status: 200,
        message: 'Jugadores obtenidos exitosamente',
        data: jugadores,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error interno del servidor',
        error_code: 'INTERNAL_SERVER_ERROR',
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const jugador = await this.jugadoresService.findOne(+id);
      return {
        status: 200,
        message: 'Jugador encontrado exitosamente',
        data: jugador,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          status: 404,
          message: error.message,
          error_code: 'NOT_FOUND',
        };
      } else {
        return {
          status: 500,
          message: 'Error interno del servidor',
          error_code: 'INTERNAL_SERVER_ERROR',
        };
      }
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number, 
    @Body() updateJugadorDto: UpdateJugadorDto
  ) {
    try {
      const jugadorActualizado = await this.jugadoresService.update(+id, updateJugadorDto);
      return {
        status: 200,
        message: 'Jugador actualizado exitosamente',
        data: jugadorActualizado,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          status: 404,
          message: error.message,
          error_code: 'NOT_FOUND',
        };
      } else if (error instanceof BadRequestException) {
        return {
          status: 400,
          message: error.message,
          error_code: 'BAD_REQUEST',
        };
      } else {
        return {
          status: 500,
          message: 'Error interno del servidor',
          error_code: 'INTERNAL_SERVER_ERROR',
        };
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.jugadoresService.remove(+id);
      return {
        status: 200,
        message: 'Jugador eliminado exitosamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          status: 404,
          message: error.message,
          error_code: 'NOT_FOUND',
        };
      } else {
        return {
          status: 500,
          message: 'Error interno del servidor',
          error_code: 'INTERNAL_SERVER_ERROR',
        };
      }
    }
  }
}
