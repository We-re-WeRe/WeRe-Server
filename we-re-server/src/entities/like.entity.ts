import { Entity, ManyToOne } from 'typeorm';
import DefaultEntity from './default.entity';
import { User } from './user.entity';
import { Webtoon } from './webtoon.entity';
import { Review } from './review.entity';
import { Storage } from './storage.entity';

// TODO:: 이 방식으로 쓰다가 enum으로 column 수를 줄이긴 해야할 듯. 뭐가 성능이 뛰어날지는 모르겠음 아직.
@Entity()
export class Like extends DefaultEntity {
  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Webtoon)
  webtoon?: Webtoon;

  @ManyToOne(() => Review, (review) => review.likes)
  review?: Review;

  @ManyToOne(() => Storage, (storage) => storage.likes)
  storage?: Storage;
}
