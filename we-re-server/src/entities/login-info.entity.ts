import { Entity, Column, OneToOne } from 'typeorm';
import DefaultEntity from './default.entity';
import { User } from './user.entity';
import { CreateLocalLoginInfoDto } from 'src/log-in/dto/create-log-in.dto';

@Entity()
export class LoginInfo extends DefaultEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  account: string;

  @Column({ type: 'varchar', length: 16 })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  kakao?: string;

  @Column({ type: 'varchar', nullable: true })
  naver?: string;

  @Column({ type: 'varchar', nullable: true })
  google?: string;

  @OneToOne(() => User, { cascade: true })
  user: User;

  public create(createLocalLoginInfoDto: CreateLocalLoginInfoDto) {
    this.account = createLocalLoginInfoDto.account;
    this.password = createLocalLoginInfoDto.password;
  }
}
