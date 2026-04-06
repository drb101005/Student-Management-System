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
import { CreateResultDto } from './dto/create-result.dto';
import { ResultsService } from './results.service';

@UseGuards(JwtAuthGuard)
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  listResults(@Req() request: AuthenticatedRequest) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.resultsService.listResults();
  }

  @Get('count')
  countResults(@Req() request: AuthenticatedRequest) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.resultsService.countResults();
  }

  @Get('me')
  myResults(@Req() request: AuthenticatedRequest) {
    ensureRole(request.user, ['student']);
    return this.resultsService.getResultsForCurrentStudent(request.user.id);
  }

  @Get('student/:studentId')
  getResultsByStudent(@Req() request: AuthenticatedRequest, @Param('studentId') studentId: string) {
    ensureRole(request.user, ['admin', 'teacher', 'student']);
    return this.resultsService.getResultsByStudent(studentId, request.user);
  }

  @Post()
  createResult(@Req() request: AuthenticatedRequest, @Body() payload: CreateResultDto) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.resultsService.createResult(payload);
  }

  @Delete(':id')
  deleteResult(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.resultsService.deleteResult(id);
  }
}
