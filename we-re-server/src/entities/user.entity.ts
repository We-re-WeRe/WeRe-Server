import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import DefaultEntity from './default.entity';

@Entity()
export class User extends DefaultEntity {
  @Column()
  userId: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column()
  sex: string;

  @Column()
  birth: Date;

  @Column()
  image: string;

  @Column()
  introduceMe!: string;

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: 'follow_join_table',
    joinColumn: { name: 'followerId' },
    inverseJoinColumn: { name: 'followingId' },
  })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];
}
