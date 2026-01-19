import { isProd } from '@/constants/env';
import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class AuthCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        if (data.accessToken && data.refreshToken) {
          response.cookie('accessToken', data.accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: isProd,
          });
          response.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: isProd,
          });
        }

        return data;
      }),
    );
  }
}
