import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule, ConfigService } from './config';
import { UsersModule } from './users';
import { AuthModule } from './auth';
import { PasswordResetsModule } from './password-resets';

function typeOrmOptionsFactory(configService: ConfigService) {
  const config = configService.get('database');

  return {
    ...config,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: !configService.isProduction,
    namingStrategy: new SnakeNamingStrategy(),
  } as TypeOrmModuleAsyncOptions;
}

@Module({
  imports: [
    ConfigModule.register(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmOptionsFactory,
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PasswordResetsModule,
  ],
})
export class AppModule {}
