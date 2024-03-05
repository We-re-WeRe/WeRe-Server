import { Entity, Column } from 'typeorm';
import DefaultEntity from './default.entity';

@Entity()
export class Storage extends DefaultEntity {
  @Column()
  kakao: string;

  @Column()
  naver: string;

  @Column()
  google: string;
}
