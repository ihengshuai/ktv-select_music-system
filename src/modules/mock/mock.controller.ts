import { Controller, Get, Req } from "@nestjs/common";
import { Body, Post, Query, UseGuards } from "@nestjs/common/decorators";
import { ForbiddenException } from "@nestjs/common/exceptions";
import { ConfigService } from "@nestjs/config";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";

import { AuthenticationGuard } from "@/common/guard/authentication-controller.guard";
import { GlobalConfiguration } from "@/config";
import { OrderDTO } from "@/dto/base-order.dto";
import { PaginationDTO } from "@/dto/base-pagination.dto";
import { sleep } from "@/utils";

import { UsersQueryDto, UsersResponseDto } from "./dto/user.dto";

const userList = [
  { id: 0, name: "曹操", sex: "remale", age: 10, hobbies: [1, 3], createTime: "2000-10-12" },
  { id: 1, name: "刘备", sex: "male", age: 20, hobbies: [2], createTime: "1998-10-17" },
  { id: 2, name: "关羽", sex: "male", age: 8, hobbies: [2, 3], createTime: "2008-01-03" },
  { id: 3, name: "张飞", sex: "remale", age: 11, hobbies: [6], createTime: "2003-10-12" },
  { id: 4, name: "赵云", sex: "remale", age: 30, hobbies: [1, 4, 6], createTime: "2005-10-12" },
  { id: 5, name: "吕布", sex: null, age: 5, hobbies: [4], createTime: "2004-10-12" },
  { id: 6, name: "袁绍", sex: null, age: 9, hobbies: [3, 5], createTime: "1999-10-12" },
  { id: 7, name: "诸葛亮", sex: "male", age: 40, hobbies: [5], createTime: "1994-10-12" },
  { id: 8, name: "周瑜", sex: null, age: 38, hobbies: [1], createTime: "2006-10-12" },
  { id: 9, name: "孙策", sex: "male", age: 27, hobbies: [3], createTime: "2010-10-12" },
  { id: 10, name: "孙权", sex: "remale", age: 50, hobbies: [5, 6], createTime: "2011-10-12" },
  { id: 11, name: "曹仁", sex: "remale", age: 16, hobbies: [3, 4, 5, 6], createTime: "2003-10-12" },
  { id: 12, name: "司马懿", sex: "remale", age: 53, hobbies: [2, 5], createTime: "1999-10-12" },
  { id: 13, name: "庞统", sex: "male", age: 33, hobbies: [4, 6], createTime: "1997-10-12" },
  { id: 14, name: "黄盖", sex: null, age: 70, hobbies: [3, 6], createTime: "2004-10-12" },
  { id: 15, name: "程普", sex: "male", age: 66, hobbies: [5], createTime: "2009-10-12" },
  { id: 16, name: "黄忠", sex: "male", age: 77, hobbies: [1, 3, 4, 5, 6], createTime: "2012-10-12" },
  { id: 17, name: "曹植", sex: "male", age: 8, hobbies: [2, 3], createTime: "2011-10-12" },
  { id: 18, name: "貂蝉", sex: "remale", age: 22, hobbies: [2, 5, 6], createTime: "2007-10-12" },
  { id: 19, name: "夏侯惇", sex: "male", age: 63, hobbies: [1, 4], createTime: "2004-10-12" },
  { id: 20, name: "袁术", sex: "male", age: 39, hobbies: [4, 5, 6], createTime: "1998-10-12" },
  { id: 21, name: "马超", sex: "male", age: 61, hobbies: [2, 6], createTime: "1998-10-12" },
];

@Controller("/mock")
@ApiTags("MockUser")
@UseGuards(AuthenticationGuard)
export class MockController {
  constructor(readonly configService: ConfigService<ReturnType<typeof GlobalConfiguration>>) {}

  @Get("/user/:id")
  async getUser() {
    await sleep(1000);
    return {
      name: "hahah",
      age: 10,
      sex: "female",
      address: {
        city: ["beijing"],
      },
    };
  }

  @Post("/user/:id")
  async updateUser(@Body() body: any) {
    await sleep(1000);
    return {
      // code: 300,
      // error: "出错了...",
      ...body,
      name: body.name?.replace(/_\d+/gi, "") + "_" + +new Date() || "hahah",
      age: (body.age || 0) + 1,
      sex: body.sex,
      address: {
        city: body?.address?.city,
      },
    };
  }

  @Get("/users")
  @ApiResponse({ type: UsersResponseDto })
  async getUsers(
    @Req() req: Request,
    @Query() filter: UsersQueryDto,
    @Query() pager: PaginationDTO,
    @Query() sorter: OrderDTO
    // @Cookie(globalConfig.COOKIE_LANG_KEY) lang: string
  ) {
    const keywords = filter.keywords || "";
    const orderBy = sorter.orderBy || null;
    const order = sorter.order || "asc";
    const sex = filter.sex;
    const page = pager.page;
    const size = pager.size;
    const birthRange = filter.birthRange;
    let result = userList.filter(({ name }) => name.includes(keywords));
    if (orderBy) {
      result = result.sort((a, b) => (order === "asc" ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy]));
    }
    if (sex !== undefined) {
      result = result.filter(u => u.sex === sex);
    }
    if (birthRange) {
      const [start, end] = birthRange.split(",");
      result = result.filter(u => new Date(u.createTime) >= new Date(start) && new Date(u.createTime) <= new Date(end));
    }
    const payload = result.slice((page - 1) * size, (page - 1) * size + size);
    await sleep(1000);

    if (req.query.testCode) {
      throw new ForbiddenException({ error: "权限不够,禁止访问" });
      // throw new HttpException("权限不够,禁止访问", HttpStatus.FORBIDDEN);
    }

    return {
      items: payload,
      pager: {
        total: result.length,
        page,
        size,
      },
    };
  }
}
