import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TestingController } from "./testing.controller";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Module({
  controllers: [TestingController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class TestingModule {}
