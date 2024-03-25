import { Injectable } from '@nestjs/common';
import { CreateWebtoonDto } from './dto/create-webtoon.dto';
import { UpdateWebtoonDto } from './dto/update-webtoon.dto';
import { WebtoonRepository } from './webtoons.repository';
import { StoragesService } from 'src/storages/storages.service';

@Injectable()
export class WebtoonsService {
  constructor(
    private readonly webtoonRepository: WebtoonRepository,
    private readonly storageService: StoragesService,
  ) {}

  async findOneDetailById(id: number) {
    const webtoon_details = await this.webtoonRepository.findOneDetailById(id);
    const storageIdArr = [];
    webtoon_details.forEach((r) => storageIdArr.push(r.storages_id));
    const storageList =
      await this.storageService.findManyPublicStorageOwnedListByIds(
        storageIdArr,
      );
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
    // TODO:: 유저 아이디를 통한 좋아요한 웹툰 id 리스트 가져오는 like service 구현 후 사용해서 받아오기.
    // 좋아요 순서는 최신 순으로 정렬해서 가져오까용
    const ids = [1, 2];
    return await this.webtoonRepository.findManyThumbnailByIds(ids);
  }
}
