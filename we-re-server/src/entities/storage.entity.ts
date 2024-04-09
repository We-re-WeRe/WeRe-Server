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

export const DISCLOSURESCOPE = {
  PRIVATE: 'pri',
  PUBLIC: 'pub',
} as const;

export type DisclosureScope =
  (typeof DISCLOSURESCOPE)[keyof typeof DISCLOSURESCOPE];

@Entity()
export class Storage extends DefaultEntity {
  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'varchar' })
  imageURL: string;

  @Column({ type: 'varchar' })
  explain: string;

  @Column({ type: 'varchar', length: 3 })
  disclosureScope: DisclosureScope;

  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Tag, (tag) => tag.storage, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  tags?: Tag[];

  @OneToMany(() => Like, (like) => like.storage)
  likes?: Like[];

  @ManyToMany(() => Webtoon, (webtoons) => webtoons.storages, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'storage_webtoon',
    joinColumn: { name: 'webtoon_id' },
    inverseJoinColumn: { name: 'storage_id' },
  })
  webtoons: Webtoon[];
}
