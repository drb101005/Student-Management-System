import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { AuthenticatedRequest } from '../common/authenticated-request';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ensureRole } from '../common/roles';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeachersService } from './teachers.service';

@UseGuards(JwtAuthGuard)
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  listTeachers(@Req() request: AuthenticatedRequest) {
    ensureRole(request.user, ['admin']);
    return this.teachersService.listTeachers();
  }

  @Post()
  createTeacher(@Req() request: AuthenticatedRequest, @Body() payload: CreateTeacherDto) {
    ensureRole(request.user, ['admin']);
    return this.teachersService.createTeacher(payload);
  }
}
