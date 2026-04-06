import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  phone!: string;

  @IsString()
  department!: string;
}
