import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email!: string;
    
    @MinLength(6) // TODO: Make better validation by conforming to the password policy (Set with Emin)
    @IsNotEmpty()
    @IsString()
    password!: string;
}