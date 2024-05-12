import { Entity, Column, OneToOne } from 'typeorm';
import DefaultEntity from './default.entity';
import { User } from './user.entity';
import { CreateLocalAuthDto } from 'src/auth/dto/create-auth.dto';

@Entity()
export class Auth extends DefaultEntity {
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

  public create(createLocalAuthDto: CreateLocalAuthDto) {
    this.account = createLocalAuthDto.account;
    this.password = createLocalAuthDto.password;
    this.user = new User();
    this.user.create(createLocalAuthDto.user);
  }
}
