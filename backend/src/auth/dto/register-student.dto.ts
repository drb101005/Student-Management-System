import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export class RegisterStudentDto {
  @IsString()
  studentId!: string;

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
  class!: string;

  @IsString()
  section!: string;

  @IsString()
  rollNumber!: string;

  @IsString()
  parentName!: string;

  @IsString()
  @IsIn(['active', 'inactive', 'graduated'])
  status!: string;
}
