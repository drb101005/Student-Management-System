import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AttendanceController } from './attendance/attendance.controller';
import { AttendanceService } from './attendance/attendance.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Attendance } from './entities/attendance.entity';
import { Result } from './entities/result.entity';
import { Student } from './entities/student.entity';
import { User } from './entities/user.entity';
import { ResultsController } from './results/results.controller';
import { ResultsService } from './results/results.service';
import { SeedService } from './seed/seed.service';
import { StatsController } from './stats/stats.controller';
import { StatsService } from './stats/stats.service';
import { StudentsController } from './students/students.controller';
import { StudentsService } from './students/students.service';
import { TeachersController } from './teachers/teachers.controller';
import { TeachersService } from './teachers/teachers.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'student-management-local-secret',
        signOptions: {
          expiresIn: '7d'
        }
      })
    }),
    TypeOrmModule.forRoot({
      type: 'sqljs',
      autoSave: true,
      location: 'data/student-management.sqlite',
      synchronize: true,
      entities: [User, Student, Attendance, Result]
    }),
    TypeOrmModule.forFeature([User, Student, Attendance, Result])
  ],
  controllers: [
    AuthController,
    StudentsController,
    TeachersController,
    AttendanceController,
    ResultsController,
    StatsController
  ],
  providers: [
    AuthService,
    StudentsService,
    TeachersService,
    AttendanceService,
    ResultsService,
    StatsService,
    SeedService,
    JwtAuthGuard
  ]
})
export class AppModule {}
