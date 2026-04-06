import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { Result } from '../entities/result.entity';
import { Student } from '../entities/student.entity';
import { User } from '../entities/user.entity';

type StudentSeed = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;

const STUDENT_ROWS: StudentSeed[] = [
  {
    studentId: 'STU-1001',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 9876500001',
    className: '10',
    section: 'A',
    rollNumber: '12',
    parentName: 'Priya Sharma',
    status: 'active',
    userId: null
  },
  {
    studentId: 'STU-1002',
    fullName: 'Diya Patel',
    email: 'diya.patel@example.com',
    phone: '+91 9876500002',
    className: '10',
    section: 'A',
    rollNumber: '18',
    parentName: 'Rakesh Patel',
    status: 'active',
    userId: null
  },
  {
    studentId: 'STU-1003',
    fullName: 'Kabir Verma',
    email: 'kabir.verma@example.com',
    phone: '+91 9876500003',
    className: '10',
    section: 'B',
    rollNumber: '07',
    parentName: 'Anita Verma',
    status: 'active',
    userId: null
  },
  {
    studentId: 'STU-1004',
    fullName: 'Meera Nair',
    email: 'meera.nair@example.com',
    phone: '+91 9876500004',
    className: '11',
    section: 'A',
    rollNumber: '03',
    parentName: 'Suresh Nair',
    status: 'active',
    userId: null
  },
  {
    studentId: 'STU-1005',
    fullName: 'Rohan Singh',
    email: 'rohan.singh@example.com',
    phone: '+91 9876500005',
    className: '11',
    section: 'B',
    rollNumber: '11',
    parentName: 'Neha Singh',
    status: 'inactive',
    userId: null
  },
  {
    studentId: 'STU-1006',
    fullName: 'Sara Khan',
    email: 'sara.khan@example.com',
    phone: '+91 9876500006',
    className: '12',
    section: 'A',
    rollNumber: '02',
    parentName: 'Imran Khan',
    status: 'active',
    userId: null
  }
];

const ATTENDANCE_DATES = ['2026-04-01', '2026-04-02', '2026-04-03', '2026-04-04', '2026-04-05'];

const RESULT_TEMPLATE = [
  ['Mid Term', 'Mathematics', 92, 100, 'A+'],
  ['Mid Term', 'Science', 88, 100, 'A'],
  ['Mid Term', 'English', 84, 100, 'A'],
  ['Unit Test', 'History', 76, 100, 'B']
] as const;

@Injectable()
export class SeedService implements OnModuleInit {
  private seedPromise: Promise<void> | null = null;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Result)
    private readonly resultsRepository: Repository<Result>
  ) {}

  onModuleInit() {
    return this.seed();
  }

  async seed() {
    if (!this.seedPromise) {
      this.seedPromise = this.seedInternal();
    }

    await this.seedPromise;
  }

  private async seedInternal() {
    const hasUsers = await this.usersRepository.count();

    if (!hasUsers) {
      await this.seedUsers();
    }

    const hasStudents = await this.studentsRepository.count();

    if (!hasStudents) {
      for (const studentRow of STUDENT_ROWS) {
        await this.studentsRepository.save(this.studentsRepository.create(studentRow));
      }
    }

    const hasAttendance = await this.attendanceRepository.count();

    if (!hasAttendance) {
      const students = await this.studentsRepository.find({ order: { studentId: 'ASC' } });

      for (const [studentIndex, student] of students.entries()) {
        for (const [dateIndex, date] of ATTENDANCE_DATES.entries()) {
          const statuses = ['present', 'present', 'late', 'absent', 'present'];
          await this.attendanceRepository.save(
            this.attendanceRepository.create({
              id: `${student.studentId}_${date}`,
              studentId: student.studentId,
              date,
              status: statuses[(studentIndex + dateIndex) % statuses.length]
            })
          );
        }
      }
    }

    const hasResults = await this.resultsRepository.count();

    if (!hasResults) {
      const students = await this.studentsRepository.find({ order: { studentId: 'ASC' } });

      for (const [studentIndex, student] of students.entries()) {
        for (const [templateIndex, [examName, subject, marks, totalMarks, grade]] of RESULT_TEMPLATE.entries()) {
          await this.resultsRepository.save(
            this.resultsRepository.create({
              studentId: student.studentId,
              examName,
              subject,
              marks: marks - studentIndex * 2 + templateIndex,
              totalMarks,
              grade
            })
          );
        }
      }
    }
  }

  private async seedUsers() {
    const sharedPasswordHash = await hash('123456', 10);

    await this.usersRepository.save(
      this.usersRepository.create({
        email: 'admin1@gmail.com',
        passwordHash: sharedPasswordHash,
        role: 'admin',
        fullName: 'Admin One',
        phone: '+91 9990001000',
        department: 'Administration',
        studentId: null,
        className: null,
        section: null,
        rollNumber: null,
        parentName: null,
        status: 'active',
        lastLoginAt: new Date()
      })
    );

    await this.usersRepository.save(
      this.usersRepository.create({
        email: 'yash@gmail.com',
        passwordHash: sharedPasswordHash,
        role: 'teacher',
        fullName: 'Yash Malhotra',
        phone: '+91 9990002000',
        department: 'Computer Science',
        studentId: null,
        className: null,
        section: null,
        rollNumber: null,
        parentName: null,
        status: 'active',
        lastLoginAt: new Date()
      })
    );
  }
}
