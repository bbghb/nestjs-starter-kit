import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../common';
import { UserEntity } from '../users';

@Entity({ name: 'password_resets' })
export class PasswordResetEntity extends BaseEntity {
  @Column()
  code: string;

  @Column()
  userId: number;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
