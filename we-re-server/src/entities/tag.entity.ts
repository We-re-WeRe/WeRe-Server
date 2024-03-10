import { Entity, Column, ManyToOne } from 'typeorm';
import DefaultEntity from './default.entity';
import { Review } from './review.entity';
import { Storage } from './storage.entity';

@Entity()
export class Tag extends DefaultEntity {
  @Column({ type: 'varchar', length: 10 })
  contents: string;

  @ManyToOne(() => Review, (review) => review.tags)
  review?: Review;

  @ManyToOne(() => Storage, (storage) => storage.tags)
  storage?: Storage;
}
