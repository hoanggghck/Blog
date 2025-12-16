import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { BlogStatus } from '../enums/blog-status.enum';

export class CreateBlogDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    slug: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    categoryId: string;

    @IsNotEmpty()
    tagId: string;

    @IsOptional()
    @IsEnum(BlogStatus)
    status?: BlogStatus;
}
