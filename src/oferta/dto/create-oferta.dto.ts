import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreateOfertaDto {  

    @IsPositive({ message: 'La puja debe ser un número positivo.' })
    @IsInt({ message: 'La puja debe ser un número entero.' })
    puja: number;

    @IsNumber()
    @IsNotEmpty()
    subastaId: number;
    
    @IsNumber()
    @IsNotEmpty()
    jugadorId: number;

}