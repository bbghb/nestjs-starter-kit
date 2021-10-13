import { Module } from '@nestjs/common';
import { HashModule } from './hash';

@Module({
  imports: [HashModule],
  exports: [HashModule],
})
export class CommonModule {}
