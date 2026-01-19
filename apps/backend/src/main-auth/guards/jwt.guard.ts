import { type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('accessToken') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    const guardsList = this.reflector.get<any[] | undefined>('__guards__', context.getHandler());
    const hasGuard = guardsList?.some((guard) => String(guard).includes('canActivate'));

    if (isPublic || hasGuard) return true;

    return super.canActivate(context);
  }
}
