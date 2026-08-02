import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicStyleEntity } from "./entity/music-style.entity";
import { MusicStyleController } from "./music-style.controller";
import { MusicStyleService } from "./music-style.service";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([MusicStyleEntity, UserEntity])],
  controllers: [MusicStyleController],
  providers: [MusicStyleService, UserService],
})
export class MusicStyleModule {}
