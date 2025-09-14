import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FileSystemService } from "@/shared/file-system/file-system.service";

import { StaticEntity } from "./entities/static.entity";
import { StaticController } from "./static.controller";
import { StaticService } from "./static.service";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([StaticEntity, UserEntity])],
  controllers: [StaticController],
  providers: [StaticService, FileSystemService, UserService],
  exports: [FileSystemService],
})
export class StaticModule {}
