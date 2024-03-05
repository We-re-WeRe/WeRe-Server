import { Entity, Column } from 'typeorm';
import DefaultEntity from './default.entity';

@Entity()
export class Tag extends DefaultEntity {
  @Column()
  contents: string;
}
