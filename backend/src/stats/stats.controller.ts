import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { AuthenticatedRequest } from '../common/authenticated-request';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ensureRole } from '../common/roles';
import { StatsService } from './stats.service';

@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('overview')
  overview(@Req() request: AuthenticatedRequest) {
    ensureRole(request.user, ['admin', 'teacher']);
    return this.statsService.overview();
  }
}
