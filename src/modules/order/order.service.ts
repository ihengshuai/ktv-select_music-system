import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PaginationDTO } from "@/dto/base-pagination.dto";

import { CreateOrderOperationDTO, QueryOrderOperationDTO } from "./dto/order-operation.dto";
import { CreateOrderPayDTO, QueryOrderPayDTO } from "./dto/order-pay.dto";
import { CreateOrderDTO, QueryOrderDTO, UpdateOrderDTO } from "./dto/order.dto";
import { OrderOperationEntity } from "./entity/order-operation.entity";
import { OrderPayEntity } from "./entity/order-pay.entity";
import { OrderEntity } from "./entity/order.entity";
import { OrderVO } from "./vo/order.vo";
import { EnumCodeEntity } from "../enum-code/entity/enum-code.entity";
import { UserEntity } from "../user/entities/user.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrderPayEntity)
    private readonly payRepository: Repository<OrderPayEntity>,

    @InjectRepository(OrderOperationEntity)
    private readonly operateRepository: Repository<OrderOperationEntity>,

    @InjectRepository(EnumCodeEntity)
    private readonly enumRepository: Repository<EnumCodeEntity>
  ) {}

  /**
   * 创建订单
   */
  async createOrder(data: CreateOrderDTO) {
    return await this.orderRepository.save(data);
  }

  /**
   * 更新订单
   */
  async updateOrder(orderNo: string, data: UpdateOrderDTO) {
    const builder = this.orderRepository.createQueryBuilder("order");
    const { affected } = await builder.where("orderNo = :orderNo", { orderNo }).update(data).execute();
    return affected > 0;
  }

  /**
   * 获取订单列表
   */
  async getOrderList(query: QueryOrderDTO, pagination: PaginationDTO) {
    const orderBuilder = this.orderRepository.createQueryBuilder("order");

    if (query.orderNo) {
      orderBuilder.andWhere("order.orderNo like :orderNo", {
        orderNo: `%${query.orderNo}%`,
      });
    }

    if (query.createTime) {
      orderBuilder.andWhere("order.createTime >= :createTime", { createTime: query.createTime });
    }

    if (query.createById) {
      orderBuilder.andWhere("order.createById = :createById", { createById: query.createById });
    }

    if (query.validityStatus) {
      orderBuilder.andWhere("order.validityStatus = :validityStatus", { validityStatus: query.validityStatus });
    }

    if (query.useStatus) {
      orderBuilder.andWhere("order.useStatus = :useStatus", { useStatus: query.useStatus });
    }

    const total = await orderBuilder.getCount();

    orderBuilder
      .leftJoin(UserEntity, "u1", "u1.uid = order.createById")
      .leftJoin(UserEntity, "u2", "u2.uid = order.updateById")
      .select([
        "order.orderNo orderNo",
        "order.longTime longTime",
        "order.password password",
        "order.payStatus payStatus",
        "order.useStatus useStatus",
        "order.validityStatus validityStatus",
        "order.startTime startTime",
        "order.createTime createTime",
        "order.updateTime updateTime",
        "order.createById createById",
        "order.updateById updateById",
        "u1.nickname as createAt",
        "u2.nickname as updateAt",
      ]);

    orderBuilder.limit(pagination.size).offset((pagination.page - 1) * pagination.size);

    const items = await orderBuilder.getRawMany();

    return {
      pager: {
        total,
        page: pagination.page,
        size: pagination.size,
      },
      items,
    };
  }

  /**
   * 获取订单详情
   */
  async getOrderDetail(orderNo: string): Promise<OrderVO> {
    const orderBuilder = this.orderRepository.createQueryBuilder("order");

    orderBuilder
      .leftJoin(UserEntity, "u1", "u1.uid = order.createById")
      .leftJoin(UserEntity, "u2", "u2.uid = order.updateById")
      .select([
        "order.orderNo orderNo",
        "order.longTime longTime",
        "order.password password",
        "order.payStatus payStatus",
        "order.useStatus useStatus",
        "order.validityStatus validityStatus",
        "order.startTime startTime",
        "order.createTime createTime",
        "order.updateTime updateTime",
        "order.createById createById",
        "order.updateById updateById",
        "u1.nickname as createAt",
        "u2.nickname as updateAt",
      ])
      .where("order.orderNo = :orderNo", { orderNo });

    const res = await orderBuilder.getRawOne();

    return res;
  }

  /**
   * 查询订单是否存在
   */
  async isOrderExist(orderNo: string) {
    const order = await this.orderRepository.findOneBy({ orderNo });
    return order;
  }

  // ==================================== 订单付费 =======================================
  /**
   * 创建付费记录
   */
  async createOrderPay(data: CreateOrderPayDTO) {
    return await this.payRepository.save(data);
  }

  /**
   * 获取订单付费记录
   */
  async getOrderPayList(query: QueryOrderPayDTO, pagination: PaginationDTO) {
    const payBuilder = this.payRepository.createQueryBuilder("pay");

    if (query.orderId) {
      payBuilder.andWhere("pay.orderId = :orderId", { orderId: query.orderId });
    }

    if (query.type) {
      payBuilder.andWhere("pay.type = :type", { type: query.type });
    }

    const [items, total] = await payBuilder
      .skip((pagination.page - 1) * pagination.size)
      .take(pagination.size)
      .getManyAndCount();

    return {
      pager: {
        total,
        page: pagination.page,
        size: pagination.size,
      },
      items,
    };
  }

  // ==================================== 订单操作 =======================================

  /**
   * 创建操作记录
   */
  async createOrderOperation(data: CreateOrderOperationDTO) {
    return await this.operateRepository.save(data);
  }

  /**
   * 获取订单操作记录
   */
  async getOrderOperationList(query: QueryOrderOperationDTO, pagination: PaginationDTO) {
    const operateBuilder = this.operateRepository.createQueryBuilder("operate");

    if (query.orderId) {
      operateBuilder.andWhere("operate.orderId = :orderId", { orderId: query.orderId });
    }

    const [items, total] = await operateBuilder
      .skip((pagination.page - 1) * pagination.size)
      .take(pagination.size)
      .getManyAndCount();

    return {
      pager: {
        total,
        page: pagination.page,
        size: pagination.size,
      },
      items,
    };
  }
}
