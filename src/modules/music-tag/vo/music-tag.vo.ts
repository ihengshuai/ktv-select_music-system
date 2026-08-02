import { ApiProperty } from "@nestjs/swagger";

export class MusicTagVO {
  @ApiProperty({ description: "标签id" })
  id: number;

  @ApiProperty({ description: "标签名称" })
  name: string;
}
