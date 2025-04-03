import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateContactDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    avatarUrl: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    nickName: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    phone: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    wxId: string;
}