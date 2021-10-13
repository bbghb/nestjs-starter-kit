import { Injectable, Inject } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

export const SALT_ROUNDS = 'SALT_ROUNDS';

@Injectable()
export class HashService {
  constructor(@Inject(SALT_ROUNDS) private rounds: number) {}

  make(value: string): Promise<string> {
    return hash(value, this.rounds);
  }

  compare(value: string, hash: string): Promise<boolean> {
    return compare(value, hash);
  }
}
