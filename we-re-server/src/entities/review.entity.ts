import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import DefaultEntity from './default.entity';
import { User } from './user.entity';
import { Webtoon } from './webtoon.entity';
import { Like } from './like.entity';
import { Tag } from './tag.entity';

@Entity()
export class Review extends DefaultEntity {
  @Column()
  contents: string;

  @Column()
  starPoint: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Webtoon)
  webtoon: Webtoon;

  @OneToMany(() => Like, (like) => like.review)
  likes?: Like[];

  @OneToMany(() => Tag, (tag) => tag.review)
  tags?: Tag[];

  @ManyToMany(() => Webtoon, (webtoon) => webtoon.reviews)
  @JoinTable({
    name: 'review_webtoon',
    joinColumn: { name: 'reviewId' },
    inverseJoinColumn: { name: 'webtoonId' },
  })
  webtoons?: Webtoon[];
}
