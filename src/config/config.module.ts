import { Module, DynamicModule } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions as NestConfigModuleOptions,
} from '@nestjs/config';
import { config } from './config';
import { ConfigService } from './config.service';

@Module({})
export class ConfigModule {
  static forRoot(options?: NestConfigModuleOptions): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          ...options,
          isGlobal: true,
          load: [config]
        })
      ],
      providers: [ConfigService],
      exports: [ConfigService],
      global: !!(options && options.isGlobal)
    };
  }
}
