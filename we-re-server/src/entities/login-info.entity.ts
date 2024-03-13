import { Entity, Column, OneToOne } from 'typeorm';
import DefaultEntity from './default.entity';
import { User } from './user.entity';

@Entity()
export class LoginInfo extends DefaultEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  userId: string;

  @Column({ type: 'varchar', length: 16 })
  password: string;

  @Column({ type: 'varchar' })
  kakao: string;

  @Column({ type: 'varchar' })
  naver: string;

  @Column({ type: 'varchar' })
  google: string;

  @OneToOne(() => User)
  user: User;
}
