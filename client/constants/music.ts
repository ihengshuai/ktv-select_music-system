import { setMetadata } from "@hengshuai/helper";

/** 歌曲状态 */
export enum MUSIC_STATUS {
  /**
   * 下架
   */
  DISABLED = "DISABLED",

  /**
   * 上架
   */
  ENABLED = "ENABLED",
}

setMetadata(MUSIC_STATUS, {
  DISABLED: {
    alias: "下架",
  },
  ENABLED: {
    alias: "上架",
  },
});
