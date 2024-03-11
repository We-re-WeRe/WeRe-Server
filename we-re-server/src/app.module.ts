import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Review } from './entities/review.entity';
import { Webtoon } from './entities/webtoon.entity';
import { Storage } from './entities/storage.entity';
import { Point } from './entities/point.entity';
import { Tag } from './entities/tag.entity';
import { Like } from './entities/like.entity';
import { SocialLoginInfo } from './entities/social-login-info.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Review,
        Webtoon,
        Storage,
        Point,
        Tag,
        Like,
        SocialLoginInfo,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
