import { Entity, Column, ManyToOne } from 'typeorm';
import DefaultEntity from './default.entity';
import { User } from './user.entity';

export const REASON = {
  SIGNIN: 'signin',
} as const;

export type Reason = (typeof REASON)[keyof typeof REASON];

@Entity()
export class Point extends DefaultEntity {
  @Column({ type: 'int', unsigned: true })
  mount: number;

  @Column({ type: 'varchar' })
  reason: Reason;

  @ManyToOne(() => User)
  user: User;
}
