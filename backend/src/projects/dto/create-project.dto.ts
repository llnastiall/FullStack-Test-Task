import {IsString, Matches} from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @Matches(/^[^\/]+\/[^\/]+$/, { message: 'Path must be in format owner/repo' })
    path: string;
}
