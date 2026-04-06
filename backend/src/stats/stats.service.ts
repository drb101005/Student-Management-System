import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeedService } from '../seed/seed.service';
import { Attendance } from '../entities/attendance.entity';
import { Result } from '../entities/result.entity';
import { Student } from '../entities/student.entity';

@Injectable()
export class StatsService {
  constructor(
    private readonly seedService: SeedService,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Result)
    private readonly resultsRepository: Repository<Result>
  ) {}

  async overview() {
    await this.seedService.seed();

    const [students, attendance, results] = await Promise.all([
      this.studentsRepository.count(),
      this.attendanceRepository.count(),
      this.resultsRepository.count()
    ]);

    return { students, attendance, results };
  }
}
