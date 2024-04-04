import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Cuenta } from "src/cuenta/entities/cuenta.entity";

enum EstadoParticipante{
    Pago = 'Pago',
    Debe ='Debe',
    Ganador = 'Ganador',
    Espera = 'Espera'
  }

export class CreateParticipanteDto {  

    @IsNumber()
    @IsOptional()
    @Min(0)
    cuota?: number;

    @IsBoolean()
    @IsOptional()
    recibido?: boolean = false;

    @IsEnum(EstadoParticipante)
    estado: 'Pago' | 'Debe' | 'Espera' | 'Ganador';

    @IsNumber()
    @IsNotEmpty()
    jugadorId: number;

    @IsString()
    @IsNotEmpty()
    partidaId: number;

    @IsNumber()
    @IsNotEmpty()
    cuentaId: number;

    @IsString()
    @IsNotEmpty()
    rolId: number;

}
