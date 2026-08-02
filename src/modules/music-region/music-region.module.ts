import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicRegionEntity } from "./entity/music-region.entity";
import { MusicRegionController } from "./music-region.controller";
import { MusicRegionService } from "./music-region.service";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([MusicRegionEntity, UserEntity])],
  controllers: [MusicRegionController],
  providers: [MusicRegionService, UserService],
})
export class MusicRegionModule {}
