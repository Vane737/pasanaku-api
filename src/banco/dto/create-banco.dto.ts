import { IsString, MinLength } from "class-validator";

export class CreateBancoDto {

    @IsString()
    @MinLength(4)
    nombre: string;

}
