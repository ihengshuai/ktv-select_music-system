import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicEntity } from "./entity/music.entity";
import { MusicController } from "./music.controller";
import { MusicService } from "./music.service";
import { MusicLanguageEntity } from "../music-language/entity/music-language.entity";
import { MusicRegionEntity } from "../music-region/entity/music-region.entity";
import { MusicSingerEntity } from "../music-singer/entity/music-singer.entity";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { MusicLyricsEntity } from "./entity/music-lyrics.entity";
import { MusicVideoEntity } from "./entity/music-video.entity";
import { MusicStyleEntity } from "../music-style/entity/music-style.entity";
import { MusicTagEntity } from "../music-tag/entity/music-tag.entity";
import { StaticEntity } from "../static/entities/static.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MusicEntity,
      MusicSingerEntity,
      MusicLanguageEntity,
      MusicLyricsEntity,
      MusicRegionEntity,
      MusicStyleEntity,
      MusicTagEntity,
      MusicVideoEntity,
      StaticEntity,
      UserEntity,
    ]),
  ],
  controllers: [MusicController],
  providers: [MusicService, UserService],
})
export class MusicModule {}
