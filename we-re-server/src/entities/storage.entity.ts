import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import DefaultEntity from './default.entity';
import { User } from './user.entity';
import { Tag } from './tag.entity';
import { Like } from './like.entity';

@Entity()
export class Storage extends DefaultEntity {
  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  explain: string;

  @Column()
  disclosureScope: string;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => Tag, (tag) => tag.id)
  tags?: Tag[];

  @OneToMany(() => Like, (like) => like.id)
  likes?: Like[];
}
