import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import DefaultEntity from './default.entity';

export const SEX = {
  MALE: 'M',
  FEMALE: 'F',
} as const;

export type Sex = (typeof SEX)[keyof typeof SEX];

@Entity()
export class User extends DefaultEntity {
  @Column({ type: 'varchar', length: 20 })
  userId: string;

  @Column({ type: 'varchar', length: 16 })
  password: string;

  @Column({ type: 'varchar' })
  imageURL: string;

  @Column({ type: 'varchar', length: 10 })
  nickname: string;

  @Column({ type: 'char', length: 1 })
  sex: Sex;

  @Column({ type: 'date' })
  birth: Date;

  @Column({ type: 'varchar', nullable: true })
  introduceMe?: string;

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
