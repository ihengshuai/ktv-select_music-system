import { ApiProperty } from "@nestjs/swagger";

import { FILE_LOCATION, FILE_TYPE } from "@/consts";
import { generateStaticURL } from "@/utils";

export class StaticVO {
  @ApiProperty({ description: "文件id" })
  id: number;

  @ApiProperty({ description: "文件标题" })
  title: string;

  @ApiProperty({ description: "文件描述" })
  remark: string;

  @ApiProperty({ description: "文件类型", enum: FILE_TYPE })
  type: FILE_TYPE;

  @ApiProperty({ description: "文件存储位置", enum: FILE_LOCATION })
  location: FILE_LOCATION;

  @ApiProperty({ description: "文件URL" })
  url: string;

  @ApiProperty({ description: "appId" })
  appId: string;

  @ApiProperty({ description: "用户id" })
  uid: string;

  @ApiProperty({ description: "用户昵称" })
  nickname: string;

  @ApiProperty({ description: "创建时间" })
  createTime: string;

  @ApiProperty({ description: "文件名" })
  fileName: string;

  constructor(entity: any) {
    this.id = entity.id;
    this.url = entity.url;
    this.appId = entity.appId;
    this.uid = entity.uid;
    this.title = entity.title;
    this.remark = entity.remark;
    this.fileName = entity.fileName;
    this.type = entity.type;
    this.location = entity.location;
    this.nickname = entity.nickname;
    this.createTime = entity.createTime;
  }

  toJSON() {
    const json = { ...this };

    json.url = generateStaticURL(json.url, json.location);

    return json;
  }
}
