import { Injectable, Logger } from '@nestjs/common';
import { Like } from 'src/entities/like.entity';
import { DataSource, Repository } from 'typeorm';
import { AddAndRemoveLikeDto, LikeRequestDto } from './dto/cud-like.dto';

@Injectable()
export class LikesRepository extends Repository<Like> {
  constructor(private readonly dataSource: DataSource) {
    super(Like, dataSource.createEntityManager());
  }

  public async findManyStorageIdsByUserId(userId: number) {
    return this.createQueryBuilder('likes')
      .where('likes.user=:userId', { userId })
      .andWhere('likes.storage IS NOT NULL')
      .select(['likes.storage_id'])
      .getRawMany();
  }

  public async findManyWebtoonIdsByUserId(userId: number) {
    return this.createQueryBuilder('likes')
      .where('likes.user=:userId', { userId })
      .andWhere('likes.webtoon_id IS NOT NULL')
      .select(['likes.webtoon_id'])
      .getRawMany();
  }

  public async findManyReviewIdsByUserId(userId: number) {
    return this.createQueryBuilder('likes')
      .where('likes.userId=:userId', { userId })
      .andWhere('likes.reviewId IS NOT NULL')
      .select(['likes.reviewId'])
      .getRawMany();
  }

  public async findIsLiked(addAndRemoveLikeDto: AddAndRemoveLikeDto) {
    return this.createQueryBuilder('likes')
      .where('likes.user=:userId', {
        userId: addAndRemoveLikeDto.userId,
      })
      .andWhere(`likes.${addAndRemoveLikeDto.likeType}=:targetId`, {
        targetId: addAndRemoveLikeDto.targetId,
      })
      .withDeleted()
      .getOne();
  }

  public async getLikeCount(likeRequestDto: LikeRequestDto) {
    return this.createQueryBuilder('likes')
      .where(`likes.${likeRequestDto.likeType}=:targetId`, {
        targetId: likeRequestDto.targetId,
      })
      .select('COUNT(likes.id) as count')
      .getRawOne();
  }

  public async createLike(addAndRemoveLikeDto: AddAndRemoveLikeDto) {
    const values = {
      user: () => `${addAndRemoveLikeDto.userId}`,
    };
    values[addAndRemoveLikeDto.likeType] = () =>
      `${addAndRemoveLikeDto.targetId}`;
    return await this.createQueryBuilder()
      .insert()
      .into(Like)
      .values({ ...values })
      .execute();
  }

  public async updateLike(id: number) {
    return await this.createQueryBuilder()
      .where('id = :id', { id })
      .restore()
      .execute();
  }
}
