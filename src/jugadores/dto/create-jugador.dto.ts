import { IsArray, IsOptional, IsString, MinLength } from "class-validator";
import { Cuenta } from "src/cuenta/entities/cuenta.entity";

export class CreateJugadorDto {

    @IsString()
    @MinLength(4)
    nombre: string;

    @IsString()
    @MinLength(8)
    telefono: string;

    @IsString()
    @MinLength(6)
    ci: string;

    @IsString()
    @MinLength(6)
    email: string;

    @IsString()
    @MinLength(6)
    contraseñaHash: string;

    @IsString()
    @MinLength(2)
    direccion: string;

    @IsArray()
    @IsOptional()
    cuentas?: Cuenta[];
}
