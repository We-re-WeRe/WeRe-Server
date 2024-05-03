import { Injectable } from '@nestjs/common';
import { Tag } from 'src/entities/tag.entity';
import { TargetTypes } from 'src/utils/types_and_enums';
import { DataSource, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(private readonly datasource: DataSource) {
    super(Tag, datasource.createEntityManager());
  }
  public async findTagsByTargetId(tagType: TargetTypes, targetId: number) {
    return await this.createQueryBuilder('tag')
      .where(`tag.${tagType}=:targetId`, { targetId })
      .getMany();
  }

  public async createTag(createTagDto: CreateTagDto) {
    const values = {
      contents: createTagDto.contents,
    };
    values[createTagDto.tagType] = () => createTagDto.targetId;
    return await this.createQueryBuilder()
      .insert()
      .into(Tag)
      .values({
        ...values,
      })
      .execute();
  }
}
