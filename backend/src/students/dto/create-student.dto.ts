import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  studentId!: string;

  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsString()
  class!: string;

  @IsString()
  section!: string;

  @IsString()
  rollNumber!: string;

  @IsString()
  parentName!: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'graduated'])
  status?: string;
}
