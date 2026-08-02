import { setMetadata } from "@hengshuai/helper";

/** 文件类型 */
export enum FILE_TYPE {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  PDF = "PDF",
  EXCEL = "EXCEL",
  PPT = "PPT",
  DOC = "DOC",
  ZIP = "ZIP",
  OTHER = "OTHER",
}

setMetadata(FILE_TYPE, {
  IMAGE: {
    alias: "图片",
  },
  VIDEO: {
    alias: "视频",
  },
  AUDIO: {
    alias: "音频",
  },
  PDF: {
    alias: "pdf文档",
  },
  EXCEL: {
    alias: "excel文档",
  },
  PPT: {
    alias: "ppt文档",
  },
  DOC: {
    alias: "docx文档",
  },
  ZIP: {
    alias: "ZIP压缩包",
  },
  OTHER: {
    alias: "其他",
  },
});

/** 文件存储位置 */
export enum FILE_LOCATION {
  /** 本地存储 */
  LOCAL = "LOCAL",
  /** 阿里云存储 */
  OSS = "OSS",
}

setMetadata(FILE_LOCATION, {
  LOCAL: {
    alias: "本地存储",
  },
  OSS: {
    alias: "阿里云存储",
  },
});
