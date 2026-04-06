import { IsIn, IsString } from 'class-validator';

export class SaveAttendanceDto {
  @IsString()
  studentId!: string;

  @IsString()
  date!: string;

  @IsString()
  @IsIn(['present', 'absent', 'late'])
  status!: string;
}
