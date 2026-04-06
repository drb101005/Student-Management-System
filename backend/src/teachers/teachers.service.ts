import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { SeedService } from '../seed/seed.service';
import { User } from '../entities/user.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';

const serializeTeacher = (teacher: User) => ({
  id: teacher.id,
  fullName: teacher.fullName,
  email: teacher.email,
  phone: teacher.phone,
  department: teacher.department,
  role: teacher.role,
  createdAt: teacher.createdAt.toISOString()
});

@Injectable()
export class TeachersService {
  constructor(
    private readonly seedService: SeedService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async listTeachers() {
    await this.seedService.seed();

    const teachers = await this.usersRepository.find({
      where: { role: 'teacher' },
      order: { createdAt: 'DESC' }
    });

    return teachers.map(serializeTeacher);
  }

  async createTeacher(payload: CreateTeacherDto) {
    await this.seedService.seed();

    const email = payload.email.toLowerCase().trim();
    const existing = await this.usersRepository.findOne({ where: { email } });

    if (existing) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const teacher = this.usersRepository.create({
      email,
      passwordHash: await hash(payload.password, 10),
      role: 'teacher',
      fullName: payload.fullName.trim(),
      phone: payload.phone.trim(),
      department: payload.department.trim(),
      studentId: null,
      className: null,
      section: null,
      rollNumber: null,
      parentName: null,
      status: 'active',
      lastLoginAt: null
    });

    return serializeTeacher(await this.usersRepository.save(teacher));
  }
}
