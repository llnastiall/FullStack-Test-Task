import { IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class RefreshTokenDto {
    @ApiProperty({ example: 'lhakjhvk.lzkjkvjhbjk.sjkhd' })
    @IsString()
    refreshToken: string;
}