import { Entity, Column } from 'typeorm';
import DefaultEntity from './default.entity';

@Entity()
export class Review extends DefaultEntity {
  @Column()
  contents: string;

  @Column()
  starPoint: number;

  @Column()
  likeCount: number;
}
