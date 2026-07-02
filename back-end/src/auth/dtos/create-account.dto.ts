import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class CreateAccountDto {

    
    @ApiProperty({ example: 'Test User' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: '1234567890' })
    @IsString()
    @IsNotEmpty()
    phone: string;
}