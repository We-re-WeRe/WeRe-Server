import { Entity, Column } from 'typeorm';
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
  introduceMe!: string;
}
