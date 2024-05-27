import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
} from 'typeorm';
import DefaultEntity from './default.entity';
import { Point } from './point.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export const SEX = {
  MALE: 'M',
  FEMALE: 'F',
} as const;

export type Sex = (typeof SEX)[keyof typeof SEX];

@Entity()
export class User extends DefaultEntity {
  @Column({ type: 'varchar', nullable: true })
  imageURL?: string;

  @Column({ type: 'varchar', length: 20 })
  nickname: string;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'char', length: 1 })
  sex: Sex;

  @Column({ type: 'date' })
  birth: Date;

  @Column({ type: 'varchar', nullable: true })
  introduceMe?: string;

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: 'follow_join_table',
    joinColumn: { name: 'follower_id' },
    inverseJoinColumn: { name: 'following_id' },
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

  public create(createUserDto: CreateUserDto) {
    this.nickname = createUserDto.nickname;
    this.name = createUserDto.name;
    this.sex = createUserDto.sex;
    this.birth = createUserDto.birth;
    return this;
  }
}
