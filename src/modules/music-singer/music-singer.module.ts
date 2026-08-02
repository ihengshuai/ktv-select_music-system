import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicSingerEntity } from "./entity/music-singer.entity";
import { MusicSingerController } from "./music-singer.controller";
import { MusicSingerService } from "./music-singer.service";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([MusicSingerEntity, UserEntity])],
  controllers: [MusicSingerController],
  providers: [MusicSingerService, UserService],
})
export class MusicSingerModule {}
