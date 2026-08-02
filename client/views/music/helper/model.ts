import { YoN } from "@/constants/common";
import { MUSIC_STATUS } from "@/constants/music";
import { IFormModel } from "@/typings/common/form";
import { ITableFilter } from "@/typings/common/table";
import { IMusicCreateDTO, IQueryMusicDTO } from "@/typings/models/music/music";
import { ICreateMusicSingerDTO, IQueryMusicSingerDTO } from "@/typings/models/music/music-singer";

/** 搜索音乐列表 */
export function createMusicTableFilter() {
  const model: ITableFilter<IQueryMusicDTO> = {
    keywords: {
      value: null,
    },
    title: {
      value: null,
    },
    singer: {
      value: null,
    },
    language: {
      value: null,
    },
    region: {
      value: null,
    },
    style: {
      value: null,
      // @ts-ignore
      defaultValue: [],
      transform: v => {
        if (v) {
          return v.join(",");
        }
        return null;
      },
      parse: val => {
        if (val) {
          return val.split(",");
        }
        return [];
      },
    },
    tag: {
      value: null,
      // @ts-ignore
      defaultValue: [],
      transform: v => {
        if (v) {
          return v.join(",");
        }
        return null;
      },
      parse: val => {
        if (val) {
          return val.split(",");
        }
        return [];
      },
    },
    status: {
      value: null,
      immediate: true,
    },
    recommend: {
      value: null,
      immediate: true,
    },
  };

  return model;
}

/** 创建音乐表单 */
export function createMusicModel() {
  const model: IFormModel<IMusicCreateDTO> = {
    title: {
      value: null,
    },
    audio: {
      value: null,
    },
    lyrics: {
      value: null,
    },
    video: {
      value: null,
    },
    singer: {
      value: null,
    },
    language: {
      value: null,
    },
    region: {
      value: null,
    },
    style: {
      // @ts-ignore
      value: [],
      type: Array,
    },
    tag: {
      // @ts-ignore
      value: [],
      type: Array,
    },
    remark: {
      value: null,
    },
    heat: {
      value: null,
    },
    status: {
      value: MUSIC_STATUS.ENABLED,
    },
    recommend: {
      value: YoN.N,
    },
  };

  return model;
}

export function createSingerTableFilter() {
  const model: ITableFilter<IQueryMusicSingerDTO> = {
    keywords: {
      value: null,
    },
  };

  return model;
}

export function createSingerModel() {
  const model: IFormModel<ICreateMusicSingerDTO> = {
    name: {
      value: null,
    },
  };

  return model;
}

export function createStyleTableFilter() {
  return createSingerTableFilter();
}

export function createStyleModel() {
  return createSingerModel();
}

export function createRegionTableFilter() {
  return createSingerTableFilter();
}

export function createRegionModel() {
  return createSingerModel();
}

export function createLanguageTableFilter() {
  return createSingerTableFilter();
}

export function createLanguageModel() {
  return createSingerModel();
}

export function createTagTableFilter() {
  return createSingerTableFilter();
}

export function createTagModel() {
  return createSingerModel();
}
