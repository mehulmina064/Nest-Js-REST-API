import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IJwtAuthGuard extends AuthGuard('internalJwt') {}
