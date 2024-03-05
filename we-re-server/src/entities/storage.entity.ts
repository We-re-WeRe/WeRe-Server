import { Entity, Column } from 'typeorm';
import DefaultEntity from './default.entity';

@Entity()
export class Storage extends DefaultEntity {
  @Column()
  name: string;

  @Column()
  explain: string;

  @Column()
  disclosureScope: string;

  @Column()
  likeCount: number;
}
