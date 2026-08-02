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

/** 文件存储位置 */
export enum FILE_LOCATION {
  /** 本地存储 */
  LOCAL = "LOCAL",
  /** 阿里云存储 */
  OSS = "OSS",
}

/** 文件大小单位 */
export enum FILE_SIZE_UNIT {
  BYTE = "B",
  KB = "KB",
  MB = "MB",
  GB = "GB",
  TB = "TB",
}

// export enum FileSizeLimit {}
