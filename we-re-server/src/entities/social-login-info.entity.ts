import { Entity, Column, OneToOne } from 'typeorm';
import DefaultEntity from './default.entity';
import { User } from './user.entity';

@Entity()
export class SocialLoginInfo extends DefaultEntity {
  @Column({ type: 'varchar' })
  kakao: string;

  @Column({ type: 'varchar' })
  naver: string;

  @Column({ type: 'varchar' })
  google: string;

  @OneToOne(() => User)
  user: User;
}
