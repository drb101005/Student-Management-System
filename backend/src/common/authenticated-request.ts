import type { Request } from 'express';
import type { SanitizedProfile } from './serializers/user.serializer';

export interface AuthenticatedRequest extends Request {
  user: SanitizedProfile;
}
