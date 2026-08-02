import { ApiProperty } from "@nestjs/swagger";

import { YON } from "@/consts";
import { BaseDateTimeVO } from "@/vo/base-datetime.vo";

export class EnumCodeVO extends BaseDateTimeVO {
  @ApiProperty({ description: "ID" })
  id: number;

  @ApiProperty({ description: "枚举键称" })
  code: string;

  @ApiProperty({ description: "枚举值" })
  value: string;

  @ApiProperty({ description: "枚举状态", enum: YON })
  status: YON = YON.Y;

  @ApiProperty({ description: "枚举描述" })
  remark: string;
}
