import { IsNotEmpty, IsOptional, IsEnum, IsString, IsNumber } from 'class-validator';
import { BlogStatus } from '../enums/blog-status.enum';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;
}
