import { Transform } from 'class-transformer';
import {  IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginJugadorDto {


    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Transform(({ value }) => value.trim())
    password: string;

}
