import { Injectable } from '@nestjs/common';
import { CreateWebtoonDto } from './dto/create-webtoon.dto';
import { UpdateWebtoonDto } from './dto/update-webtoon.dto';
import { WebtoonRepository } from './webtoons.repository';
import {
  PROVIDINGCOMPANY,
  stringToDays,
  stringToProvidingCompany,
} from 'src/entities/webtoon.entity';
import {
  ReadWebtoonBriefDto,
  ReadWebtoonDetailDto,
  ReadWebtoonThumbnailDto,
} from './dto/read-webtoon.dto';
import {
  CustomDataBaseException,
  CustomNotFoundException,
} from 'src/utils/custom_exceptions';
import { LikesService } from 'src/likes/likes.service';
import { LikeRequestDto } from 'src/likes/dto/cud-like.dto';
import { TARGET_TYPES } from 'src/utils/types_and_enums';
import { ReviewsService } from 'src/reviews/reviews.service';
import { ReadLikeInfoDto } from 'src/likes/dto/read-like.dto';

@Injectable()
export class WebtoonsService {
  constructor(
    private readonly webtoonRepository: WebtoonRepository,
    private readonly likeService: LikesService,
    private readonly reviewsService: ReviewsService,
  ) {}

  /**
   * service to get webtoon detail info with related storage brief info list.
   * @param id
   * @returns {ReadWebtoonDetailDto}
   */
  async findOneDetailById(
    id: number,
    userId: number,
  ): Promise<ReadWebtoonDetailDto> {
    const queryResult = await this.webtoonRepository.findOneDetailById(id);
    Logger.log(JSON.stringify(queryResult));
    if (!queryResult) throw new CustomNotFoundException('id');
    const result = new ReadWebtoonDetailDto(queryResult);
    result.like = await this.getLikeInfo(userId, id);
    return result;
  }

  /**
   * service to get list of thumbnail of webtoons by id.
   * @param ids
   * @returns {ReadWebtoonThumbnailDto[]}
   */
  async findManyThumbnailByIds(
    ids: number[],
  ): Promise<ReadWebtoonThumbnailDto[]> {
    if (ids.length > 0) {
      const queryResult = await this.webtoonRepository.findManyThumbnailByIds(
        ids,
      );
      const result = queryResult.map((r) => new ReadWebtoonThumbnailDto(r));
      return result;
    } else return [];
  }

  /**
   * do filtering to get webtoon  list for webtoon list page
   * @param dayString string formatted day
   * @param providingCompaniesString  string formatted providing company
   * @returns {ReadWebtoonThumbnailDto[]}
   */
  async findManyFilteredThumbnail(
    dayString: string,
    providingCompaniesString: string,
  ): Promise<ReadWebtoonThumbnailDto[]> {
    const day = stringToDays(dayString);
    const providingCompanies = stringToProvidingCompany(
      providingCompaniesString,
    );
    const queryResult = await this.webtoonRepository.findManyFilteredThumbnail(
      day,
      providingCompanies
        ? [providingCompanies]
        : [PROVIDINGCOMPANY.KAKAO, PROVIDINGCOMPANY.NAVER],
    );
    const result = queryResult.map((r) => new ReadWebtoonThumbnailDto(r));
    return result;
  }

  /**
   * Get New webtoons!
   * @returns {ReadWebtoonThumbnailDto[]}
   */
  async findManyNewThumbnail(): Promise<ReadWebtoonThumbnailDto[]> {
    const queryResult = await this.webtoonRepository.findManyThumbnail('new');
    const result = queryResult.map((r) => new ReadWebtoonThumbnailDto(r));
    return result;
  }

  /**
   * Get New webtoons!
   * @returns {ReadWebtoonThumbnailDto[]}
   */
  async findManyHotThumbnail(): Promise<ReadWebtoonThumbnailDto[]> {
    const queryResult = await this.webtoonRepository.findManyThumbnail('hot');
    const result = queryResult.map((r) => new ReadWebtoonThumbnailDto(r));
    return result;
  }
  /**
   * Get webtoon id list and user id from storage service and return webtoon breif infos
   * @param ids
   * @param userId
   * @returns {Webtoon[]} webtoon breif list with related reviews
   */
  async findManyBreifInfoWithReviewByOwnerId(
    ids: number[],
    ownerId: number,
    userId: number,
  ): Promise<ReadWebtoonBriefDto[]> {
    const queryResult = await this.webtoonRepository.findManyBreifInfoByIds(
      ids,
    );
    const result = await Promise.all(
      queryResult.map(async (r) => {
        const temp = new ReadWebtoonBriefDto(r);
        temp.review = await this.reviewsService.findOneByOwnerAndWebtoonId(
          userId,
          ownerId,
          temp.id,
        );
        temp.like = await this.getLikeInfo(userId, temp.id);
        return temp;
      }),
    );
    return result;
  }

  /**
   * create webtoon and return webtoon detail
   * @param createWebtoonDto
   * @returns {Promise<ReadWebtoonDetailDto>}
   */
  async createWebtoon(createWebtoonDto: CreateWebtoonDto) {
    const queryResult = await this.webtoonRepository.createWebtoon(
      createWebtoonDto,
    );
    const id = queryResult.identifiers[0].id;
    if (!id) {
      throw new CustomDataBaseException('create is not worked.');
    }
    return;
  }

  /**
   * update webtoon and return webtoon detail
   * @param updateStorageDto
   * @returns {Promise<ReadWebtoonDetailDto>}
   */
  async updateWebtoon(updateWebtoonDto: UpdateWebtoonDto) {
    const queryResult = await this.webtoonRepository.update(
      updateWebtoonDto.id,
      updateWebtoonDto,
    );
    if (!queryResult.affected) {
      throw new CustomNotFoundException('id');
    }
    return;
  }

  /**
   * delete Webtoon.
   * @param id
   * @returns {Promise<void>}
   */
  async deleteWebtoon(id: number): Promise<void> {
    const queryResult = await this.webtoonRepository.delete(id);
    if (!queryResult.affected) {
      // storage is not deleted. error handling plz.
      throw new CustomNotFoundException('id');
    }
    return;
  }

  async getLikeInfo(userId: number, id: number): Promise<ReadLikeInfoDto> {
    const likeRequestDto = new LikeRequestDto(userId, TARGET_TYPES.WEBTOON, id);

    return await this.likeService.getReadLikeInfoDto(likeRequestDto);
  }
}
