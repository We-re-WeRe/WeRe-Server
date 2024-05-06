import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { StoragesService } from './storages.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import {
  ReadStorageBriefDto,
  ReadStorageDetailDto,
} from './dto/read-storage.dto';
import { LikesService } from 'src/likes/likes.service';
import { UsersService } from 'src/users/users.service';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { WebtoonInStorageDto } from './dto/webtoon-in-storage.dto';
import {
  CustomBadTypeRequestException,
  CustomUnauthorziedException,
} from 'src/utils/custom_exceptions';
import { TagsService } from 'src/tags/tags.service';
import { TARGET_TYPES } from 'src/utils/types_and_enums';
import { AddAndRemoveTagRequestDto } from 'src/tags/dto/process-tag.dto';

@ApiTags('Storages')
@Controller('storages')
export class StoragesController {
  constructor(
    private readonly storagesService: StoragesService,
    private readonly likesService: LikesService,
    private readonly userService: UsersService,
    private readonly tagsService: TagsService,
  ) {}

  @ApiOperation({ summary: 'get Storage detail' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadStorageDetailDto,
  })
  @Get('detail/:id')
  async findOneDetailById(
    @Param('id') id: number,
  ): Promise<ReadStorageDetailDto> {
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      const result = await this.storagesService.findOneDetailById(id);
      const readTagDtoArray = await this.tagsService.findTagsByTargetId(
        TARGET_TYPES.STORAGE,
        id,
      );
      result.tags = readTagDtoArray;
      const readUserBriefDto = await this.userService.findOneBriefById(
        result.user.getId(),
      );
      result.user = readUserBriefDto;
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'get all of the Storages as list' })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadStorageBriefDto],
  })
  @Get('list')
  async findManyPublicStorageList(): Promise<ReadStorageBriefDto[]> {
    try {
      return await this.storagesService.findManyPublicStorageList();
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'get Storages which is owned by User as list' })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadStorageBriefDto],
  })
  @Get('list/user/:userId')
  async findManyStorageListByUserId(
    @Param('userId') userId: number,
  ): Promise<ReadStorageBriefDto[]> {
    try {
      if (!userId) throw new CustomBadTypeRequestException('userId', userId);
      return await this.storagesService.findManyStorageListByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'get Storages which is liked by User as list' })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadStorageBriefDto],
  })
  @Get('list/liked/user/:userId')
  async findManyPublicStorageLikedListByIds(
    @Param('userId') userId: number,
  ): Promise<ReadStorageBriefDto[]> {
    //TODO:: user id 본인 건지 체크 필요.
    try {
      if (!userId) throw new CustomBadTypeRequestException('userId', userId);
      const { storageIds: ids } =
        await this.likesService.findManyStorageIdsByUserId(userId);
      return await this.storagesService.findManyPublicStorageListByIds(ids);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'create Storage' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: ReadStorageDetailDto,
  })
  @Post()
  async createStorage(
    @Body() createStorageDto: CreateStorageDto,
  ): Promise<ReadStorageDetailDto> {
    try {
      // TODO:: create data 조건 해야함.
      const { tags } = createStorageDto;
      const result = await this.storagesService.createStorage(createStorageDto);
      if (!!tags) {
        const addAndRemoveTagRequestDto = new AddAndRemoveTagRequestDto(
          TARGET_TYPES.STORAGE,
          result.id,
          tags,
        );
        const createTagResult = await this.tagsService.addAndRemoveTag(
          addAndRemoveTagRequestDto,
        );
        result.tags = createTagResult;
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'add webtoon to Storage' })
  @ApiOkResponse({ description: 'Request Success', type: ReadStorageDetailDto })
  @Patch(':id')
  async updateStorage(
    @Param('id') id: number,
    @Body() updateStorageDto: UpdateStorageDto,
  ): Promise<ReadStorageDetailDto> {
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      if (id !== updateStorageDto.id)
        throw new CustomUnauthorziedException(`id is wrong.`);
      const { tags, ...tempUpdateStorageDto } = updateStorageDto;
      const result = await this.storagesService.updateStorage(
        tempUpdateStorageDto,
      );
      if (!!tags) {
        const addAndRemoveTagRequestDto = new AddAndRemoveTagRequestDto(
          TARGET_TYPES.STORAGE,
          result.id,
          tags,
        );
        const createTagResult = await this.tagsService.addAndRemoveTag(
          addAndRemoveTagRequestDto,
        );
        result.tags = createTagResult;
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'add webtoon to Storage' })
  @ApiAcceptedResponse({
    description: 'Request Success',
    type: ReadStorageDetailDto,
  })
  @Patch(':id/webtoon/:webtoonId')
  async addWebtoonAtStorage(
    @Param() webtoonInStorageDto: WebtoonInStorageDto,
  ): Promise<ReadStorageDetailDto> {
    try {
      await this.storagesService.addWebtoonAtStorage(webtoonInStorageDto);
      // return이 storage detail이 맞나? webtoon 페이지에서 빼고 더하고 할텐데?
      return await this.storagesService.findOneDetailById(
        webtoonInStorageDto.id,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'delete webtoon to Storage' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadStorageDetailDto,
  })
  @Delete(':id/webtoon/:webtoonId')
  async removeWebtoonAtStorage(
    @Param() webtoonInStorageDto: WebtoonInStorageDto,
  ): Promise<ReadStorageDetailDto> {
    // 삭제 잘 되었다는 status code 반환~
    try {
      await this.storagesService.removeWebtoonAtStorage(webtoonInStorageDto);
      return await this.storagesService.findOneDetailById(
        webtoonInStorageDto.id,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'delete Storage' })
  @ApiNoContentResponse({ description: 'Request Success' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteReview(@Param('id') id: number): Promise<void> {
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      return this.storagesService.deleteReview(id);
    } catch (error) {
      throw error;
    }
  }
}
