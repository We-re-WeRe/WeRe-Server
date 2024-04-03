import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class WebtoonsService {
  constructor(private readonly webtoonRepository: WebtoonRepository) {}

  /**
   * service to get webtoon detail info with related storage brief info list.
   * @param id
   * @returns {ReadWebtoonDetailDto}
   */
  async findOneDetailById(id: number): Promise<ReadWebtoonDetailDto> {
    const queryResult = await this.webtoonRepository.findOneDetailById(id);
    const result = new ReadWebtoonDetailDto(queryResult);
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
   * Get webtoon id list from storage service and return webtoon breif infos
   * @param storageId storage id
   * @returns {Webtoon[]} webtoon breif list with related reviews
   */
  async findManyBreifInfoWithReviewByStorageId(
    ids: number[],
    userId: number,
  ): Promise<ReadWebtoonBriefDto[]> {
    const queryResult =
      await this.webtoonRepository.findManyBreifInfoWithReviewByIds(
        ids,
        userId,
      );
    const result = queryResult.map((r) => new ReadWebtoonBriefDto(r));
    return result;
  }
}
