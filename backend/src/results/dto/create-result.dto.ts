import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateResultDto {
  @IsString()
  studentId!: string;

  @IsString()
  subject!: string;

  @IsInt()
  @Min(0)
  marks!: number;

  @IsInt()
  @Min(1)
  @Max(1000)
  totalMarks!: number;

  @IsString()
  examName!: string;

  @IsString()
  grade!: string;
}
