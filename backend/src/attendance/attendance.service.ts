import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeedService } from '../seed/seed.service';
import { Attendance } from '../entities/attendance.entity';
import { User } from '../entities/user.entity';
import { SaveAttendanceDto } from './dto/save-attendance.dto';

const serializeAttendance = (record: Attendance) => ({
  id: record.id,
  studentId: record.studentId,
  date: record.date,
  status: record.status,
  updatedAt: record.updatedAt.toISOString()
});

@Injectable()
export class AttendanceService {
  constructor(
    private readonly seedService: SeedService,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async listAttendance() {
    await this.seedService.seed();

    const rows = await this.attendanceRepository.find({
      order: { date: 'DESC' }
    });

    return rows.map(serializeAttendance);
  }

  async countAttendance() {
    await this.seedService.seed();
    return this.attendanceRepository.count();
  }

  async saveAttendance(payload: SaveAttendanceDto) {
    await this.seedService.seed();

    const recordId = `${payload.studentId.trim()}_${payload.date.trim()}`;
    const existing = await this.attendanceRepository.findOne({ where: { id: recordId } });

    const record = existing ?? this.attendanceRepository.create({ id: recordId });
    record.studentId = payload.studentId.trim();
    record.date = payload.date.trim();
    record.status = payload.status;

    return serializeAttendance(await this.attendanceRepository.save(record));
  }

  async deleteAttendance(recordId: string) {
    await this.seedService.seed();

    const record = await this.attendanceRepository.findOne({ where: { id: recordId } });

    if (!record) {
      throw new NotFoundException('Attendance record not found.');
    }

    await this.attendanceRepository.remove(record);
    return { success: true };
  }

  async getAttendanceByStudent(studentId: string, user: Pick<User, 'role' | 'studentId'>) {
    await this.seedService.seed();

    if (user.role === 'student' && user.studentId !== studentId) {
      throw new NotFoundException('Attendance record not found.');
    }

    const rows = await this.attendanceRepository.find({
      where: { studentId },
      order: { date: 'DESC' }
    });

    return rows.map(serializeAttendance);
  }

  async getAttendanceForCurrentStudent(userId: string) {
    await this.seedService.seed();

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user?.studentId) {
      throw new NotFoundException('No student record is linked to this account.');
    }

    return this.getAttendanceByStudent(user.studentId, user);
  }
}
