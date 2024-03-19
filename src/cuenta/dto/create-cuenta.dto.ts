import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateCuentaDto {
    
    @IsString()
    @MinLength(20)
    nro: string;

    @IsString()
    @MinLength(2)
    @MaxLength(2)
    departamento: string;

    @IsString()
    @MinLength(1)
    jugadorId: string;
}
