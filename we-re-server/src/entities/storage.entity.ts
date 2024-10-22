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
import { Tag } from './tag.entity';
import { Like } from './like.entity';
import { Webtoon } from './webtoon.entity';

const DEFAULT_IMAGE_URL =
  'https://www.nofire.co.kr/shopimages/ks0713/028012000016.jpg?1642063081';

@Entity()
export class Storage extends DefaultEntity {
  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', nullable: true, default: DEFAULT_IMAGE_URL })
  imageURL?: string;

  @Column({ type: 'varchar', length: 300 })
  explain: string;

  @Column({ type: 'tinyint', width: 1 })
  isPublic: boolean;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Tag, (tag) => tag.storage)
  tags?: Tag[];

  @OneToMany(() => Like, (like) => like.storage)
  likes?: Like[];

  @ManyToMany(() => Webtoon, (webtoons) => webtoons.storages)
  @JoinTable({ name: 'storage_webtoon' })
  webtoons: Webtoon[];
}
