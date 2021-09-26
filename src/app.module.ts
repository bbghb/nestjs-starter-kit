import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule, ConfigService } from './config';
import { UsersModule } from './users';
import { AuthModule } from './auth';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: !configService.isProduction,
        namingStrategy: new SnakeNamingStrategy()
      } as TypeOrmModuleAsyncOptions),
      inject: [ConfigService]
    }),

    UsersModule,

    AuthModule,
  ],
})
export class AppModule {}
