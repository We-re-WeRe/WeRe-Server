import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import DefaultEntity from './default.entity';
import { Point } from './point.entity';

export const SEX = {
  MALE: 'M',
  FEMALE: 'F',
} as const;

export type Sex = (typeof SEX)[keyof typeof SEX];

@Entity()
export class User extends DefaultEntity {
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

  @ManyToMany(() => User, (user) => user.followers, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  following: User[];

  @OneToMany(() => Point, (points) => points.user)
  points: Point[];
}
