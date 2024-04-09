import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Storages')
@Controller('storages')
export class StoragesController {
  constructor(
    private readonly storagesService: StoragesService,
    private readonly likesService: LikesService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({ summary: 'get Storage detail' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadStorageDetailDto,
  })
  @Get('detail/:id')
  async findOneDetailById(
    @Param('id') id: string,
  ): Promise<ReadStorageDetailDto> {
    const result = await this.storagesService.findOneDetailById(+id);
    const readUserBriefDto = await this.userService.findOneBriefById(
      result.user.getId(),
    );
    result.user = readUserBriefDto;
    return result;
  }

  @ApiOperation({ summary: 'get all of the Storages as list' })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadStorageBriefDto],
  })
  @Get('list')
  async findManyPublicStorageList(): Promise<ReadStorageBriefDto[]> {
    return await this.storagesService.findManyPublicStorageList();
  }

  @ApiOperation({ summary: 'get Storages which is owned by User as list' })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadStorageBriefDto],
  })
  @Get('list/user/:userId')
  async findManyStorageListByUserId(
    @Param('userId') userId: string,
  ): Promise<ReadStorageBriefDto[]> {
    return await this.storagesService.findManyStorageListByUserId(+userId);
  }

  @ApiOperation({ summary: 'get Storages which is liked by User as list' })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadStorageBriefDto],
  })
  @Get('list/liked/user/:userId')
  async findManyPublicStorageLikedListByIds(
    @Param('userId') userId: string,
  ): Promise<ReadStorageBriefDto[]> {
    //TODO:: user id 본인 건지 체크 필요.
    const { storage_ids: ids } =
      await this.likesService.findManyStorageIdsByUserId(+userId);
    return await this.storagesService.findManyPublicStorageListByIds(ids);
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
    return await this.storagesService.createStorage(createStorageDto);
  }
}
