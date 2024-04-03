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

    @IsString()
    @IsNotEmpty()
    jugadorId: string;

    @IsString()
    @IsNotEmpty()
    partidaId: string;

    @IsString()
    @IsNotEmpty()
    cuentaId: string;

    @IsString()
    @IsNotEmpty()
    rolId: string;

}
