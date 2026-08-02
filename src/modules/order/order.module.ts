import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrderOperationEntity } from "./entity/order-operation.entity";
import { OrderPayEntity } from "./entity/order-pay.entity";
import { OrderEntity } from "./entity/order.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { EnumCodeEntity } from "../enum-code/entity/enum-code.entity";
import { EnumCodeService } from "../enum-code/enum-code.service";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, EnumCodeEntity, OrderEntity, OrderPayEntity, OrderOperationEntity])],

  controllers: [OrderController],
  providers: [OrderService, UserService, EnumCodeService],
})
export class OrderModule {}
