import { Controller, Post,Get, Param } from '@nestjs/common';
import { TransferenciaService } from './transferencia.service';

@Controller('transferencia')
export class TransferenciaController {
    constructor(private readonly transferenciaService: TransferenciaService) {}

    //Devuelve transferencias de un jugador
    @Get(':id')
    transferencias(@Param('id') id: number) {
    return this.transferenciaService.transferencias(id);
    }
}
