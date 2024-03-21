import { Entity, Column, ManyToMany } from 'typeorm';
import DefaultEntity from './default.entity';
import { Storage } from './storage.entity';

export const DAYS = {
  MONDAY: 'mon',
  TUESDAY: 'tue',
  WEDNESDAY: 'wed',
  THURSDAY: 'thu',
  FRIDAY: 'fri',
  SATURDAY: 'sat',
  SUNDAY: 'sun',
} as const;

export const PROVIDINGCOMPANY = {
  KAKAO: 'k',
  NAVER: 'n',
} as const;

export type ProvidingCompany =
  (typeof PROVIDINGCOMPANY)[keyof typeof PROVIDINGCOMPANY];

export type Days = (typeof DAYS)[keyof typeof DAYS];

@Entity()
export class Webtoon extends DefaultEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  imageURL: string;

  @Column({ type: 'varchar' })
  webtoonURL: string;

  @Column({ type: 'varchar' })
  author: string;

  @Column({ type: 'varchar' })
  painter: string;

  @Column({ type: 'char', length: 1 })
  providingCompany: ProvidingCompany;

  @Column({ type: 'varchar', length: 3, nullable: true })
  day?: Days;

  @Column({ nullable: true })
  genre?: string;

  @Column({ nullable: true })
  explain?: string;

  @Column({ unsigned: true, type: 'int' })
  viewCount: number;

  @ManyToMany(() => Storage, (storage) => storage.webtoons, {
    nullable: true,
  })
  storages?: Storage[];
}
