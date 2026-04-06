import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeedService } from '../seed/seed.service';
import { Result } from '../entities/result.entity';
import { User } from '../entities/user.entity';
import { CreateResultDto } from './dto/create-result.dto';

const serializeResult = (result: Result) => ({
  id: result.id,
  studentId: result.studentId,
  subject: result.subject,
  marks: result.marks,
  totalMarks: result.totalMarks,
  examName: result.examName,
  grade: result.grade,
  createdAt: result.createdAt.toISOString()
});

@Injectable()
export class ResultsService {
  constructor(
    private readonly seedService: SeedService,
    @InjectRepository(Result)
    private readonly resultsRepository: Repository<Result>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async listResults() {
    await this.seedService.seed();

    const rows = await this.resultsRepository.find({
      order: { createdAt: 'DESC' }
    });

    return rows.map(serializeResult);
  }

  async countResults() {
    await this.seedService.seed();
    return this.resultsRepository.count();
  }

  async createResult(payload: CreateResultDto) {
    await this.seedService.seed();

    const result = this.resultsRepository.create({
      studentId: payload.studentId.trim(),
      subject: payload.subject.trim(),
      marks: payload.marks,
      totalMarks: payload.totalMarks,
      examName: payload.examName.trim(),
      grade: payload.grade.trim()
    });

    return serializeResult(await this.resultsRepository.save(result));
  }

  async deleteResult(id: string) {
    await this.seedService.seed();

    const result = await this.resultsRepository.findOne({ where: { id } });

    if (!result) {
      throw new NotFoundException('Result record not found.');
    }

    await this.resultsRepository.remove(result);
    return { success: true };
  }

  async getResultsByStudent(studentId: string, user: Pick<User, 'role' | 'studentId'>) {
    await this.seedService.seed();

    if (user.role === 'student' && user.studentId !== studentId) {
      throw new NotFoundException('Result record not found.');
    }

    const rows = await this.resultsRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' }
    });

    return rows.map(serializeResult);
  }

  async getResultsForCurrentStudent(userId: string) {
    await this.seedService.seed();

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user?.studentId) {
      throw new NotFoundException('No student record is linked to this account.');
    }

    return this.getResultsByStudent(user.studentId, user);
  }
}
