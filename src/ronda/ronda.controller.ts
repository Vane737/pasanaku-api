import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { RondaService } from './ronda.service';

@Controller('ronda')
export class RondaController {

    constructor(
        private readonly rondaService: RondaService,
    ) {}

    //Devuelve la ronda
    @Get(':id')
    findOne(@Param('id') id: number) {
    return this.rondaService.findOne( id );
    }


    
    
}
