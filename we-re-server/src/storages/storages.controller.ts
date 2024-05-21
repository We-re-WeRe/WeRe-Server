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
  Query,
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
import { Public, UserId } from 'src/utils/custom_decorators';

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
  @Public()
  @Get('detail')
  async findOneDetailById(
    @UserId() userId: number,
    @Query('id') id: number,
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
      result.setIsMine(userId);
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
  @Public()
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
  @Public()
  @Get('list/user')
  async findManyStorageListByUserId(
    @Query('userId') ownerId: number,
  ): Promise<ReadStorageBriefDto[]> {
    try {
      if (!ownerId) throw new CustomBadTypeRequestException('ownerId', ownerId);
      return await this.storagesService.findManyStorageListByUserId(ownerId);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'get Storages which is liked by User as list' })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadStorageBriefDto],
  })
  @Get('list/liked')
  async findManyPublicStorageLikedListByIds(
    @UserId() userId: number,
  ): Promise<ReadStorageBriefDto[]> {
    try {
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
    @UserId() userId: number,
    @Body() createStorageDto: CreateStorageDto,
  ): Promise<ReadStorageDetailDto> {
    try {
      // TODO:: create data 조건 해야함.
      const { tags } = createStorageDto;
      const result = await this.storagesService.createStorage(
        userId,
        createStorageDto,
      );
      const addAndRemoveTagRequestDto = new AddAndRemoveTagRequestDto(
        TARGET_TYPES.STORAGE,
        result.id,
        tags,
      );
      const createTagResult = await this.tagsService.addAndRemoveTag(
        addAndRemoveTagRequestDto,
      );
      result.tags = createTagResult;
      result.setIsMine(userId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'update webtoon to Storage' })
  @ApiOkResponse({ description: 'Request Success', type: ReadStorageDetailDto })
  @Patch()
  async updateStorage(
    @UserId() userId: number,
    @Body() updateStorageDto: UpdateStorageDto,
  ): Promise<ReadStorageDetailDto> {
    try {
      const { tags, ...tempUpdateStorageDto } = updateStorageDto;
      const result = await this.storagesService.updateStorage(
        userId,
        tempUpdateStorageDto,
      );
      const addAndRemoveTagRequestDto = new AddAndRemoveTagRequestDto(
        TARGET_TYPES.STORAGE,
        result.id,
        tags,
      );
      const createTagResult = await this.tagsService.addAndRemoveTag(
        addAndRemoveTagRequestDto,
      );
      result.tags = createTagResult;
      result.setIsMine(userId);
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
  @Patch('webtoon')
  async addWebtoonAtStorage(
    @UserId() userId: number,
    @Query() webtoonInStorageDto: WebtoonInStorageDto,
  ): Promise<void> {
    try {
      await this.storagesService.addWebtoonAtStorage(
        userId,
        webtoonInStorageDto,
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
  @Delete('webtoon')
  async removeWebtoonAtStorage(
    @UserId() userId: number,
    @Query() webtoonInStorageDto: WebtoonInStorageDto,
  ): Promise<void> {
    try {
      await this.storagesService.removeWebtoonAtStorage(
        userId,
        webtoonInStorageDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'delete Storage' })
  @ApiNoContentResponse({ description: 'Request Success' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  deleteReview(
    @UserId() userId: number,
    @Query('id') id: number,
  ): Promise<void> {
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      return this.storagesService.deleteStorage(id, userId);
    } catch (error) {
      throw error;
    }
  }
}
