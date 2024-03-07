import { Entity, Column, ManyToMany } from 'typeorm';
import DefaultEntity from './default.entity';
import { Review } from './review.entity';

@Entity()
export class Webtoon extends DefaultEntity {
  @Column()
  title: string;

  @Column()
  image: string;

  @Column()
  author: string;

  @Column()
  providingCompany: string;

  @Column()
  day?: string;

  @Column()
  genre!: string;

  @Column()
  explain?: string;

  @Column()
  viewCount: number;

  @ManyToMany(() => Review, (review) => review.webtoons)
  reviews?: Review[];
}
