import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../common/authenticated-request';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ensureRole } from '../common/roles';
import { AttendanceService } from './attendance.service';
import { SaveAttendanceDto } from './dto/save-attendance.dto';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  listAttendance(@Req() request: AuthenticatedRequest) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.attendanceService.listAttendance();
  }

  @Get('count')
  countAttendance(@Req() request: AuthenticatedRequest) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.attendanceService.countAttendance();
  }

  @Get('me')
  myAttendance(@Req() request: AuthenticatedRequest) {
    ensureRole(request.user, ['student']);
    return this.attendanceService.getAttendanceForCurrentStudent(request.user.id);
  }

  @Get('student/:studentId')
  getAttendanceByStudent(@Req() request: AuthenticatedRequest, @Param('studentId') studentId: string) {
    ensureRole(request.user, ['admin', 'teacher', 'student']);
    return this.attendanceService.getAttendanceByStudent(studentId, request.user);
  }

  @Post()
  saveAttendance(@Req() request: AuthenticatedRequest, @Body() payload: SaveAttendanceDto) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.attendanceService.saveAttendance(payload);
  }

  @Delete(':id')
  deleteAttendance(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.attendanceService.deleteAttendance(id);
  }
}
