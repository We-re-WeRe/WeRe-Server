import { Entity, Column, OneToOne } from 'typeorm';
import DefaultEntity from './default.entity';
import { User } from './user.entity';

@Entity()
export class SocialLoginInfo extends DefaultEntity {
  @Column()
  kakao: string;

  @Column()
  naver: string;

  @Column()
  google: string;

  @OneToOne(() => User)
  user: User;
}
