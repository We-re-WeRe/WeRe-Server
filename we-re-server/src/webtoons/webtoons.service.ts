import { Injectable, Logger } from '@nestjs/common';
import { CreateWebtoonDto } from './dto/create-webtoon.dto';
import { UpdateWebtoonDto } from './dto/update-webtoon.dto';
import { WebtoonRepository } from './webtoons.repository';
import { StoragesService } from 'src/storages/storages.service';
import {
  PROVIDINGCOMPANY,
  Webtoon,
  stringToDays,
  stringToProvidingCompany,
} from 'src/entities/webtoon.entity';
import { LikesService } from 'src/likes/likes.service';

@Injectable()
export class WebtoonsService {
  constructor(
    private readonly webtoonRepository: WebtoonRepository,
    private readonly storageService: StoragesService,
    private readonly likeService: LikesService,
  ) {}

  async findOneDetailById(id: number) {
    const webtoon_details = await this.webtoonRepository.findOneDetailById(id);
    const storageIdArr = [];
    webtoon_details.forEach((r) => storageIdArr.push(r.storages_id));
    const storageList =
      await this.storageService.findManyPublicStorageListByIds(storageIdArr);
    const result = { ...webtoon_details[0], storageList };
    delete result.storages_id;
    return result;
  }

  /**
   * @description 해당 유저의 좋아요 누른 웹툰 리스트를 반환한다.
   * @param userId 웹툰을 좋아요 누른 유저 아이디.
   * @returns 이미지 url, 제목, 글/그림 작가, id 를 필드로 가진 객체들의 배열 반환.
   */
  async findManyLikedThumbnailByUserId(userId: number) {
    // TODO:: 본인인지 체크 필요.
    const { webtoon_ids: ids } =
      await this.likeService.findManyWebtoonIdsByUserId(userId);
    return await this.webtoonRepository.findManyThumbnailByIds(ids);
  }

  /**
   * do filtering to get webtoon  list for webtoon list page
   * @param dayString string formatted day
   * @param providingCompaniesString  string formatted providing company
   * @returns {Webtoon[]}
   */
  async findManyFilteredThumbnail(
    dayString: string,
    providingCompaniesString: string,
  ) {
    const day = stringToDays(dayString);
    const providingCompanies = stringToProvidingCompany(
      providingCompaniesString,
    );
    return await this.webtoonRepository.findManyFilteredThumbnail(
      day,
      providingCompanies
        ? [providingCompanies]
        : [PROVIDINGCOMPANY.KAKAO, PROVIDINGCOMPANY.NAVER],
    );
  }

  /**
   * Get New webtoons!
   * @returns {Webtoon[]}
   */
  async findManyNewThumbnail() {
    return await this.webtoonRepository.findManyNewThumbnail();
  }

  /**
   * Get New webtoons!
   * @returns {Webtoon[]}
   */
  async findManyHotThumbnail() {
    return await this.webtoonRepository.findManyHotThumbnail();
  }

  /**
   * Get webtoon id list from storage service and return webtoon breif infos
   * @param storageId storage id
   * @returns {Webtoon[]} webtoon breif list with related reviews
   */
  async findManyBreifInfoWithReviewByStorageId(storageId: number) {
    // TODO:: NULL일때 Error 처리 필요.
    const { webtoonIds: ids, userId } =
      await this.storageService.findWebtoonIdListById(storageId);
    return await this.webtoonRepository.findManyBreifInfoWithReviewByIds(
      ids,
      userId,
    );
  }
}
