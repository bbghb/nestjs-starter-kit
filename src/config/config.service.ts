import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService, Path, PathValue } from '@nestjs/config';
import { Environment } from '../common';
import { Config } from './config';

@Injectable()
export class ConfigService extends NestConfigService<Config> {
  override get<T = Config, P extends Path<T> = any, R = PathValue<T, P>>(path: P): R {
    return super.get<T, P, R>(path, { infer: true });
  }

  get isProduction(): boolean {
    return this.get('app.environment') === Environment.Production;
  }
}
