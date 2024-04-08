import { Entity, Column, ManyToOne } from 'typeorm';
import DefaultEntity from './default.entity';
import { User } from './user.entity';

export const REASON = {
  SIGNON: 'signon',
  USED: 'used',
} as const;

export const POINT_BY_REASON = {
  SIGNON: 500,
  USED: 0,
} as const;

export type Reason = (typeof REASON)[keyof typeof REASON];

@Entity()
export class Point extends DefaultEntity {
  @Column({ type: 'int' })
  mount: number;

  @Column({ type: 'varchar' })
  reason: Reason;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}

export function getPointMountByReason(value: string): number {
  const key = Object.keys(REASON).find(
    (key) => REASON[key as Reason] === value,
  );
  return POINT_BY_REASON[key];
}
