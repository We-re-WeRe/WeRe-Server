import { Entity, Column } from 'typeorm';
import DefaultEntity from './default.entity';

@Entity()
export class Point extends DefaultEntity {
  @Column()
  reason: string;
}
