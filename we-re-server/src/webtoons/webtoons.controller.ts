import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { WebtoonsService } from './webtoons.service';
import { CreateWebtoonDto } from './dto/create-webtoon.dto';
import { UpdateWebtoonDto } from './dto/update-webtoon.dto';
import { LikesService } from 'src/likes/likes.service';
import {
  ReadWebtoonBriefDto,
  ReadWebtoonDetailDto,
  ReadWebtoonThumbnailDto,
} from './dto/read-webtoon.dto';
import { StoragesService } from 'src/storages/storages.service';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CustomBadTypeRequestException,
  CustomUnauthorziedException,
} from 'src/utils/custom_exceptions';
import {
  stringToDays,
  stringToProvidingCompany,
} from 'src/entities/webtoon.entity';
import { Cookies, Public, UserId } from 'src/utils/custom_decorators';
import { Response } from 'express';
import {
  RECENT_VIEWED_COOKIE_KEY,
  VISITED_LIST_COOKIE_KEY,
} from 'src/utils/types_and_enums';

@ApiTags('Webtoons')
@Controller('webtoons')
export class WebtoonsController {
  constructor(
    private readonly webtoonsService: WebtoonsService,
    private readonly likeService: LikesService,
    private readonly storageService: StoragesService,
  ) {}

  @ApiOperation({ summary: 'get Webtoon detail' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadWebtoonDetailDto,
  })
  @Public()
  @Get('detail')
  async findOneDetailById(
    @UserId() userId: number,
    @Query('id') id: number,
    @Cookies(VISITED_LIST_COOKIE_KEY) visitedList: string,
    @Cookies(RECENT_VIEWED_COOKIE_KEY) recentList: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ReadWebtoonDetailDto> {
    if (!id) throw new CustomBadTypeRequestException('id', id);

    const result = await this.webtoonsService.findOneDetailById(id, userId);

    // 최근 및 조회 목록 확인하고 업데이트.
    if (!!result && !this.isIdInUnderBarString(visitedList, id)) {
      const updatedVisitedList = this.updateVisitedList(visitedList, id);
      // 새로 조회할 때마다 조회수 업데이트 맞아...? 고민 ㄱ
      this.webtoonsService.updateViewCount(id);
      this.setDataInCookie(res, VISITED_LIST_COOKIE_KEY, updatedVisitedList, 1);
    }
    const updatedRecentList = this.updateRecentList(recentList, id);
    this.setDataInCookie(res, RECENT_VIEWED_COOKIE_KEY, updatedRecentList, 14);

    const result = await this.webtoonsService.findOneDetailById(id, userId);
    return result;
  }

  @ApiOperation({
    summary: '최근 본 웹툰 목록(10개) 전달 api',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadWebtoonThumbnailDto],
  })
  @Public()
  @Get('list/recent')
  async findManyRecentThumbnail(
    @Cookies(RECENT_VIEWED_COOKIE_KEY) recentList: string,
  ): Promise<ReadWebtoonThumbnailDto[]> {
    const ids = this.decodeUnderbarStringToList(recentList).map(
      this.decodeBase32ToNumber,
    );
    return this.webtoonsService.findManyThumbnailByIds(ids);
  }

  @ApiOperation({
    summary: 'get Webtoon Thumbnail List which is liked by user',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadWebtoonThumbnailDto],
  })
  @Get('list/liked')
  async findManyLikedThumbnailByUserId(
    @UserId() userId: number,
  ): Promise<ReadWebtoonThumbnailDto[]> {
    const { webtoonIds: ids } =
      await this.likeService.findManyWebtoonIdsByUserId(userId);
    return this.webtoonsService.findManyThumbnailByIds(ids);
  }

  @ApiOperation({
    summary: 'get Webtoon Thumbnail List which is new updated',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadWebtoonThumbnailDto],
  })
  @Public()
  @Get('list/new')
  findManyNewThumbnail(): Promise<ReadWebtoonThumbnailDto[]> {
    return this.webtoonsService.findManyNewThumbnail();
  }

  @ApiOperation({
    summary: 'get Webtoon Thumbnail List which is hot updated',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadWebtoonThumbnailDto],
  })
  @Public()
  @Get('list/hot')
  findManyHotThumbnail(): Promise<ReadWebtoonThumbnailDto[]> {
    return this.webtoonsService.findManyHotThumbnail();
  }

  @ApiOperation({
    summary: 'get Webtoon Brief List which is in Storage',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadWebtoonBriefDto],
  })
  @Public()
  @Get('list/storage')
  async findManyBreifInfoWithReviewByStorageId(
    @UserId() userId: number,
    @Query('storageId') storageId: number,
  ): Promise<ReadWebtoonBriefDto[]> {
    if (!storageId)
      throw new CustomBadTypeRequestException('storageId', storageId);
    const { webtoonIds: ids, userId: ownerId } =
      await this.storageService.findWebtoonIdListById(storageId);
    const result =
      await this.webtoonsService.findManyBreifInfoWithReviewByOwnerId(
        ids,
        ownerId,
        userId,
      );
    return result;
  }

  @ApiOperation({
    summary:
      'get Webtoon Thumbnail List which is Filtered by Day and Providing Company',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadWebtoonThumbnailDto],
  })
  @Public()
  @Get('list/filtered-by')
  findManyFilteredThumbnail(
    @Query('day') day: string,
    @Query('providingCompany') providingCompany: string,
  ): Promise<ReadWebtoonThumbnailDto[]> {
    if (!stringToDays(day)) {
      throw new CustomBadTypeRequestException('day', day);
    }
    if (!stringToProvidingCompany(providingCompany)) {
      throw new CustomBadTypeRequestException(
        'providingCompany',
        providingCompany,
      );
    }
    return this.webtoonsService.findManyFilteredThumbnail(
      day,
      providingCompany,
    );
  }

  @ApiOperation({ summary: 'create Webtoon' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: ReadWebtoonDetailDto,
  })
  @Post()
  async createWebtoon(@Body() createWebtoonDto: CreateWebtoonDto) {
    // 아무나 upload 못하게 해야할듯. webtoon 추가를 그냥 python에서 하든동.
    await this.webtoonsService.createWebtoon(createWebtoonDto);
    return;
  }

  @ApiOperation({ summary: 'update Webtoon' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: ReadWebtoonDetailDto,
  })
  @Public()
  @Patch()
  async updateWebtoon(
    @Query('id') id: number,
    @Body() updateWebtoonDto: UpdateWebtoonDto,
  ) {
    if (!id) throw new CustomBadTypeRequestException('id', id);
    if (id !== updateWebtoonDto.id)
      throw new CustomUnauthorziedException(`id is wrong.`);
    await this.webtoonsService.updateWebtoon(updateWebtoonDto);
    return;
  }

  @ApiOperation({ summary: 'delete Webtoon' })
  @ApiNoContentResponse({ description: 'Request Success' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteWebtoon(@Query('id') id: number): Promise<void> {
    if (!id) throw new CustomBadTypeRequestException('id', id);
    return await this.webtoonsService.deleteWebtoon(id);
  }

  /**
   * id를 32진수로 인코딩
   * @param id webtoonId
   * @returns encodedId
   */
  encodeNumberToBase32 = (id: number): string => id.toString(32);

  /**
   * 32진수 문자열을 숫자로 디코딩
   * @param base32String 32진수로 표현된 문자열
   * @returns webtoonId
   */
  decodeBase32ToNumber = (base32String: string): number =>
    parseInt(base32String, 32);

  /**
   * 쿠키에 저장된 '_' 기준 구분 배열 문자열을 list로 반환하는 함수.
   * @param underbarString cookie에 저장된 '_'로 구분된 문자열
   * @returns webtoonId list
   */
  decodeUnderbarStringToList = (underbarString: string): string[] => {
    return underbarString?.split('_') || [];
  };

  /**
   * 문자열에 특정 id가 있는지 확인하는 메소드.
   * @param underbarString cookie에 저장된 '_'로 구분된 문자열
   * @param id webtoon id
   * @returns boolean
   */
  isIdInUnderBarString = (underBarString: string, id: number): boolean => {
    const vlist = this.decodeUnderbarStringToList(underBarString);
    return vlist.indexOf(id.toString(32)) >= 0;
  };

  /**
   * 조회 목록을 업데이트하는 함수.
   * @param visitedList 당일 조회한 웹툰 id 목록이 담긴 문자열.
   * @param id webtoon id
   * @returns 업데이트된 문자열.
   */
  updateVisitedList = (visitedList: string, id: number): string => {
    const idEncoded32 = this.encodeNumberToBase32(id);

    return (!!visitedList ? visitedList + '_' : '') + idEncoded32;
  };

  /**
   * 최근 본 목록 업데이트
   * @param recentList 최근 본 웹툰 목록.
   * @param id webtoon id
   * @returns 업데이트된 문자열
   */
  updateRecentList = (recentList: string, id: number): string => {
    const idEncoded32 = this.encodeNumberToBase32(id);
    const rlist = this.decodeUnderbarStringToList(recentList);
    const idx = rlist.indexOf(idEncoded32);

    if (idx >= 0)
      [rlist[idx], rlist[rlist.length - 1]] = [
        rlist[rlist.length - 1],
        rlist[idx],
      ];
    else {
      while (rlist.length >= 10) {
        rlist.shift();
      }
      rlist.push(idEncoded32);
    }

    return rlist.join('_');
  };

  /**
   * 쿠키에 업데이트된 데이터 저장.
   * @param res response
   * @param key cookie key
   * @param value cookie value
   * @param expires expires date
   */
  setDataInCookie = (
    res: Response,
    key: string,
    value: string,
    expires: number,
  ): void => {
    const today = new Date(new Date().toLocaleDateString());
    today.setDate(today.getDate() + expires);
    today.setHours(today.getHours() + 9);

    res.cookie(key, value, {
      path: '', // cookie path는 domain을 따라야하는 듯하다..? 빈 값을 넣어서 webtoons path의 쿠키를 가져온다.
      httpOnly: true,
      expires: today,
    });
  };
}
