import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';
import { PartidaService } from './partida.service';

@Controller('partida')
export class PartidaController {
  constructor(private readonly partidaService: PartidaService) {}

  @Post()
  create(@Body() createPartidaDto: CreatePartidaDto) {
    return this.partidaService.create( createPartidaDto );
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
