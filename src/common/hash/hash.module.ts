import { Module } from '@nestjs/common';
import { HashService, SALT_ROUNDS } from './hash.service';

@Module({
  providers: [
    {
      provide: SALT_ROUNDS,
      useValue: 10
    },
    HashService,
  ],
  exports: [HashService]
})
export class HashModule {}
