import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicTagEntity } from "./entity/music-tag.entity";
import { MusicTagController } from "./music-tag.controller";
import { MusicTagService } from "./music-tag.service";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([MusicTagEntity, UserEntity])],
  controllers: [MusicTagController],
  providers: [MusicTagService, UserService],
})
export class MusicTagModule {}
