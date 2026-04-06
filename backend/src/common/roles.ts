import { ForbiddenException } from '@nestjs/common';
import type { SanitizedProfile, UserRole } from './serializers/user.serializer';

export const ensureRole = (user: SanitizedProfile, roles: UserRole[]) => {
  if (!roles.includes(user.role)) {
    throw new ForbiddenException('You do not have access to this resource.');
  }
};
