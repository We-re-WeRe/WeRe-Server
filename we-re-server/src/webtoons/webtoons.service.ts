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
}
