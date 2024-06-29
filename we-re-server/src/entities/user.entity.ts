import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import DefaultEntity from './default.entity';
import { Point } from './point.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export const SEX = {
  MALE: 'M',
  FEMALE: 'F',
} as const;

export type Sex = (typeof SEX)[keyof typeof SEX];

const DEFAULT_IMAGE_URL =
  'https://d3kxs6kpbh59hp.cloudfront.net/community/COMMUNITY/451e60229e7945a5a81258ebb8cabdaa/aaaa744cf80b4c71b2473334addcde9e_1535190560.jpg';

@Entity()
export class User extends DefaultEntity {
  @Column({ type: 'varchar', nullable: true, default: DEFAULT_IMAGE_URL })
  imageURL?: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  nickname: string;

  @Column({ type: 'varchar', length: 10 })
  name: string;

  @Column({ type: 'char', length: 1 })
  sex: Sex;

  @Column({ type: 'date' })
  birth: Date;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  introduceMe?: string;

  @ManyToMany(() => User, (user) => user.following)
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'follow_join_table',
    joinColumn: { name: 'follower_id' },
    inverseJoinColumn: { name: 'following_id' },
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
