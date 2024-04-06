import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateParticipanteDto } from 'src/participante/dto/create-participante.dto';
import { ParticipanteService } from 'src/participante/participante.service';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';
import { PartidaService } from './partida.service';

@Controller('partida')
export class PartidaController {
  constructor(
    private readonly partidaService: PartidaService,
    private readonly participanteService: ParticipanteService

    ) {}

  @Post()
  async create(@Body() requestData: any) {
    console.log(requestData);
    const createPartidaDto = requestData.createPartidaDto;
    const idJugador = requestData.idJugador;
    
    const partida = await this.partidaService.create( createPartidaDto );
    const createParticipanteDto: CreateParticipanteDto = {
      cuota: 0,
      recibido: false,
      estado: 'Espera',
      jugadorId: idJugador,
      partidaId: partida.id,
      rolId: 1
    };
    const participante = await this.participanteService.create(createParticipanteDto);
    return partida;
    
  }

  @Get()
  findAll() {
    return this.partidaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.partidaService.findOne( id );
  }

  /*@Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updatePartidaDto: UpdatePartidaDto) {
    return this.partidaService.update( id, updatePartidaDto );
  }
*/
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.partidaService.remove( id );
  }

}
