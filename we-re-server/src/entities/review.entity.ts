import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import DefaultEntity from './default.entity';
import { User } from './user.entity';
import { Webtoon } from './webtoon.entity';
import { Like } from './like.entity';
import { Tag } from './tag.entity';

@Entity()
export class Review extends DefaultEntity {
  @Column({ type: 'varchar' })
  contents: string;

  @Column({ type: 'int', unsigned: true })
  starPoint: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Webtoon)
  webtoon: Webtoon;

  @OneToMany(() => Like, (like) => like.review)
  likes?: Like[];

  @OneToMany(() => Tag, (tag) => tag.review, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  tags?: Tag[];
}
