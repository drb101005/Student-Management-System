import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../common/authenticated-request';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ensureRole } from '../common/roles';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  listStudents(@Req() request: AuthenticatedRequest) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.studentsService.listStudents();
  }

  @Get('count')
  countStudents(@Req() request: AuthenticatedRequest) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.studentsService.countStudents();
  }

  @Get('me')
  getMyStudentRecord(@Req() request: AuthenticatedRequest) {
    ensureRole(request.user, ['student']);
    return this.studentsService.getCurrentStudentRecord(request.user.id);
  }

  @Post()
  createStudent(@Req() request: AuthenticatedRequest, @Body() payload: CreateStudentDto) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.studentsService.createStudent(payload);
  }

  @Patch(':id')
  updateStudent(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() payload: UpdateStudentDto
  ) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.studentsService.updateStudent(id, payload);
  }

  @Delete(':id')
  deleteStudent(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.studentsService.deleteStudent(id);
  }
}
