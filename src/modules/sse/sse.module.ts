import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SseController } from "./sse.controller";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Module({
  controllers: [SseController],

  imports: [TypeOrmModule.forFeature([UserEntity])],

  providers: [UserService],
  exports: [UserService],
})
export class SseModule {}
