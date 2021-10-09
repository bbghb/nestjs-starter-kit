import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../users';

@Injectable()
export class VerifiedEmailGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;

    return user.isEmailVerified;
  }
}
