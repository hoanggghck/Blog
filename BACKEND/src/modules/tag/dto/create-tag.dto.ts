import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTagDto {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsString()
    slug: string;
    
    @IsOptional()
    @IsString()
    description?: string;
}
