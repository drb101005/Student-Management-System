import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { Result } from '../entities/result.entity';
import { Student } from '../entities/student.entity';
import { User } from '../entities/user.entity';
import { serializeProfile, serializeUser } from '../common/serializers/user.serializer';
import { SeedService } from '../seed/seed.service';
import { LoginDto } from './dto/login.dto';
import { RegisterStudentDto } from './dto/register-student.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly seedService: SeedService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Result)
    private readonly resultsRepository: Repository<Result>
  ) {}

  async login(credentials: LoginDto) {
    await this.seedService.seed();

    const user = await this.usersRepository.findOne({
      where: { email: credentials.email.toLowerCase().trim() }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const matches = await compare(credentials.password, user.passwordHash);

    if (!matches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    user.lastLoginAt = new Date();
    await this.usersRepository.save(user);

    return this.createSession(user);
  }

  async registerStudent(payload: RegisterStudentDto) {
    await this.seedService.seed();

    const email = payload.email.toLowerCase().trim();
    const existingUser = await this.usersRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new BadRequestException('An account with this email already exists.');
    }

    const existingStudent = await this.studentsRepository.findOne({
      where: { studentId: payload.studentId.trim() }
    });

    if (existingStudent) {
      throw new BadRequestException('This student ID already exists.');
    }

    const passwordHash = await hash(payload.password, 10);

    const user = this.usersRepository.create({
      email,
      passwordHash,
      role: 'student',
      fullName: payload.fullName.trim(),
      phone: payload.phone.trim(),
      department: null,
      studentId: payload.studentId.trim(),
      className: payload.class.trim(),
      section: payload.section.trim(),
      rollNumber: payload.rollNumber.trim(),
      parentName: payload.parentName.trim(),
      status: payload.status
    });

    const savedUser = await this.usersRepository.save(user);
    savedUser.lastLoginAt = new Date();
    await this.usersRepository.save(savedUser);

    const student = this.studentsRepository.create({
      studentId: payload.studentId.trim(),
      fullName: payload.fullName.trim(),
      email,
      phone: payload.phone.trim(),
      className: payload.class.trim(),
      section: payload.section.trim(),
      rollNumber: payload.rollNumber.trim(),
      parentName: payload.parentName.trim(),
      status: payload.status,
      userId: savedUser.id
    });

    await this.studentsRepository.save(student);
    await this.seedStarterResultsForStudent(student.studentId);

    return this.createSession(savedUser);
  }

  async getCurrentProfile(userId: string) {
    await this.seedService.seed();

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return {
      user: serializeUser(user),
      profile: serializeProfile(user)
    };
  }

  private async createSession(user: User) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return {
      accessToken,
      user: serializeUser(user),
      profile: serializeProfile(user)
    };
  }

  private async seedStarterResultsForStudent(studentId: string) {
    const existingResults = await this.resultsRepository.count({ where: { studentId } });

    if (existingResults > 0) {
      return;
    }

    const resultRows = [
      ['Orientation Quiz', 'Mathematics', 84, 100, 'A'],
      ['Orientation Quiz', 'Science', 88, 100, 'A'],
      ['Orientation Quiz', 'English', 91, 100, 'A+']
    ];

    for (const [examName, subject, marks, totalMarks, grade] of resultRows) {
      await this.resultsRepository.save(
        this.resultsRepository.create({
          studentId,
          examName,
          subject,
          marks,
          totalMarks,
          grade
        })
      );
    }
  }
}
