import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicLanguageEntity } from "./entity/music-language.entity";
import { MusicLanguageController } from "./music-language.controller";
import { MusicLanguageService } from "./music-language.service";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([MusicLanguageEntity, UserEntity])],
  controllers: [MusicLanguageController],
  providers: [MusicLanguageService, UserService],
})
export class MusicLanguageModule {}
