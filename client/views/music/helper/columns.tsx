import { Tag } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";

import TextSingleEllipsis from "@/components/common/text-ellipsis/text-single-ellipsis";
import { YoN } from "@/constants/common";
import { MUSIC_STATUS } from "@/constants/music";
import { getEnumEntity } from "@/helper";
import { IMusicVO } from "@/typings/models/music/music";
import { IMusicLanguageVO } from "@/typings/models/music/music-language";
import { IMusicRegionVO } from "@/typings/models/music/music-region";
import { IMusicSingerVO } from "@/typings/models/music/music-singer";
import { IMusicStyleVO } from "@/typings/models/music/music-style";
import { IMusicTagVO } from "@/typings/models/music/music-tag";

export function createMusicColumns() {
  const columns: ColumnsType<IMusicVO> = [
    {
      title: "歌曲ID",
      dataIndex: "uid",
      key: "uid",
      width: 220,
      customRender: ({ text }) => <TextSingleEllipsis text={text} />,
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width: 140,
      customRender: ({ text }) => <TextSingleEllipsis text={text} />,
    },
    {
      title: "歌手",
      dataIndex: "singerName",
      key: "singer",
      width: 120,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      sorter: true,
      customRender: ({ text }) => (
        <Tag color={text === MUSIC_STATUS.ENABLED ? "green" : "red"}>{getEnumEntity(MUSIC_STATUS, text).alias}</Tag>
      ),
    },
    {
      title: "是否推荐",
      dataIndex: "recommend",
      key: "recommend",
      width: 100,
      sorter: true,
      customRender: ({ text }) => (
        <span class={text === YoN.Y ? "text-green" : "text-red"}>{getEnumEntity(YoN, text).alias}</span>
      ),
    },

    {
      title: "热度",
      dataIndex: "heat",
      key: "heat",
      width: 80,
      sorter: true,
    },
    {
      title: "语种",
      dataIndex: "languageName",
      key: "language",
      width: 120,
    },
    {
      title: "地区",
      dataIndex: "regionName",
      key: "region",
      width: 140,
    },
    {
      title: "风格",
      dataIndex: "style",
      key: "style",
      width: 140,
      customRender: ({ text }) => <TextSingleEllipsis text={text && text?.map((l: any) => l.name).join(",")} />,
    },
    {
      title: "标签",
      dataIndex: "tag",
      key: "tag",
      width: 120,
      customRender: ({ text }) => <TextSingleEllipsis text={text && text?.map((l: any) => l.name).join(",")} />,
    },

    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 180,
    },
    {
      title: "创建者",
      dataIndex: "createBy",
      key: "createBy",
      width: 120,
      fixed: "right",
      customRender: ({ text }) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "操作",
      key: "operation",
      fixed: "right",
      width: 80,
      align: "center",
    },
  ];

  return columns;
}

export function createMusicSingerColumns() {
  const columns: ColumnsType<IMusicSingerVO> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "歌手名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
  ];

  return columns;
}

export function createMusicStyleColumns() {
  const columns: ColumnsType<IMusicStyleVO> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "风格名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
  ];

  return columns;
}

export function createMusicRegionColumns() {
  const columns: ColumnsType<IMusicRegionVO> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "地区名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
  ];

  return columns;
}

export function createMusicLanguageColumns() {
  const columns: ColumnsType<IMusicLanguageVO> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "语种名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
  ];

  return columns;
}

export function createMusicTagColumns() {
  const columns: ColumnsType<IMusicTagVO> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "标签名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
  ];

  return columns;
}
