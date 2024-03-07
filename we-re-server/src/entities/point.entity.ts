import { Entity, Column, ManyToOne } from 'typeorm';
import DefaultEntity from './default.entity';
import { User } from './user.entity';

@Entity()
export class Point extends DefaultEntity {
  @Column()
  reason: string;

  @ManyToOne(() => User)
  user: User;
}
