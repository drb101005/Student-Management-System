import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { User } from '../entities/user.entity';
import { SeedService } from '../seed/seed.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

const serializeStudent = (student: Student) => ({
  id: student.id,
  studentId: student.studentId,
  fullName: student.fullName,
  email: student.email,
  phone: student.phone,
  class: student.className,
  section: student.section,
  rollNumber: student.rollNumber,
  parentName: student.parentName,
  status: student.status,
  userId: student.userId,
  createdAt: student.createdAt.toISOString(),
  updatedAt: student.updatedAt.toISOString()
});

@Injectable()
export class StudentsService {
  constructor(
    private readonly seedService: SeedService,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async listStudents() {
    await this.seedService.seed();

    const students = await this.studentsRepository.find({
      order: { createdAt: 'DESC' }
    });

    return students.map(serializeStudent);
  }

  async countStudents() {
    await this.seedService.seed();
    return this.studentsRepository.count();
  }

  async createStudent(payload: CreateStudentDto) {
    await this.seedService.seed();
    await this.ensureUniqueStudent(payload.studentId, payload.email);

    const student = this.studentsRepository.create({
      studentId: payload.studentId.trim(),
      fullName: payload.fullName.trim(),
      email: payload.email.toLowerCase().trim(),
      phone: payload.phone.trim(),
      className: payload.class.trim(),
      section: payload.section.trim(),
      rollNumber: payload.rollNumber.trim(),
      parentName: payload.parentName.trim(),
      status: payload.status ?? 'active',
      userId: null
    });

    return serializeStudent(await this.studentsRepository.save(student));
  }

  async updateStudent(studentId: string, payload: UpdateStudentDto) {
    await this.seedService.seed();

    const student = await this.studentsRepository.findOne({ where: { id: studentId } });

    if (!student) {
      throw new NotFoundException('Student record not found.');
    }

    if (payload.studentId && payload.studentId.trim() !== student.studentId) {
      const duplicateStudent = await this.studentsRepository.findOne({
        where: { studentId: payload.studentId.trim() }
      });

      if (duplicateStudent) {
        throw new BadRequestException('A student with this ID already exists.');
      }
    }

    if (payload.email && payload.email.toLowerCase().trim() !== student.email) {
      const duplicateEmail = await this.studentsRepository.findOne({
        where: { email: payload.email.toLowerCase().trim() }
      });

      if (duplicateEmail) {
        throw new BadRequestException('A student with this email already exists.');
      }
    }

    student.studentId = payload.studentId?.trim() ?? student.studentId;
    student.fullName = payload.fullName?.trim() ?? student.fullName;
    student.email = payload.email?.toLowerCase().trim() ?? student.email;
    student.phone = payload.phone?.trim() ?? student.phone;
    student.className = payload.class?.trim() ?? student.className;
    student.section = payload.section?.trim() ?? student.section;
    student.rollNumber = payload.rollNumber?.trim() ?? student.rollNumber;
    student.parentName = payload.parentName?.trim() ?? student.parentName;
    student.status = payload.status ?? student.status;

    if (student.userId) {
      const linkedUser = await this.usersRepository.findOne({ where: { id: student.userId } });

      if (linkedUser) {
        linkedUser.email = student.email;
        linkedUser.fullName = student.fullName;
        linkedUser.phone = student.phone;
        linkedUser.studentId = student.studentId;
        linkedUser.className = student.className;
        linkedUser.section = student.section;
        linkedUser.rollNumber = student.rollNumber;
        linkedUser.parentName = student.parentName;
        linkedUser.status = student.status;
        await this.usersRepository.save(linkedUser);
      }
    }

    return serializeStudent(await this.studentsRepository.save(student));
  }

  async deleteStudent(studentId: string) {
    await this.seedService.seed();

    const student = await this.studentsRepository.findOne({ where: { id: studentId } });

    if (!student) {
      throw new NotFoundException('Student record not found.');
    }

    await this.studentsRepository.remove(student);
    return { success: true };
  }

  async getCurrentStudentRecord(userId: string) {
    await this.seedService.seed();

    const student = await this.studentsRepository.findOne({
      where: { userId }
    });

    if (!student) {
      throw new NotFoundException('No linked student profile was found.');
    }

    return serializeStudent(student);
  }

  private async ensureUniqueStudent(studentId: string, email: string) {
    const [duplicateId, duplicateEmail] = await Promise.all([
      this.studentsRepository.findOne({ where: { studentId: studentId.trim() } }),
      this.studentsRepository.findOne({ where: { email: email.toLowerCase().trim() } })
    ]);

    if (duplicateId) {
      throw new BadRequestException('A student with this ID already exists.');
    }

    if (duplicateEmail) {
      throw new BadRequestException('A student with this email already exists.');
    }
  }
}
