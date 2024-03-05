import { Entity, Column } from 'typeorm';
import DefaultEntity from './default.entity';

@Entity()
export class Webtoon extends DefaultEntity {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  providingCompany: string;

  @Column()
  day!: string;

  @Column()
  genre!: string;

  @Column()
  explain!: string;

  @Column()
  viewCount: number;

  @Column()
  starPointAverage: number;

  @Column()
  reviewCount: number;

  @Column()
  likeCount: number;
}
