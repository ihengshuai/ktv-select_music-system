import { IFormRules } from "@/typings/common/form";
import { IMusicCreateDTO } from "@/typings/models/music/music";
import { ICreateMusicLanguageDTO } from "@/typings/models/music/music-language";
import { ICreateMusicRegionDTO } from "@/typings/models/music/music-region";
import { ICreateMusicSingerDTO } from "@/typings/models/music/music-singer";
import { ICreateMusicStyleDTO } from "@/typings/models/music/music-style";
import { ICreateMusicTagDTO } from "@/typings/models/music/music-tag";

export function createMusicRules() {
  const rules: IFormRules<IMusicCreateDTO> = {
    title: {
      async validator(rule, field) {
        if (!field.value) return Promise.reject("歌名不能为空");
        return Promise.resolve();
      },
      trigger: "blur",
      required: true,
    },
    singer: {
      async validator(rule, field) {
        if (!field.value) return Promise.reject("请选择歌手");
        return Promise.resolve();
      },
      trigger: "change",
      required: true,
    },
    audio: {
      async validator(rule, field) {
        if (!field.value) return Promise.reject("请上传音频文件");
        return Promise.resolve();
      },
      required: true,
    },
    language: {
      async validator(rule, field) {
        if (!field.value) return Promise.reject("请选择语种");
        return Promise.resolve();
      },
      trigger: "change",
      required: true,
    },
    region: {
      async validator(rule, field) {
        if (!field.value) return Promise.reject("请选择地区");
        return Promise.resolve();
      },
      trigger: "change",
      required: true,
    },
  };

  return rules;
}

export function createSingerRules() {
  const rules: IFormRules<ICreateMusicSingerDTO> = {
    name: {
      async validator(rule, field) {
        if (!field.value) return Promise.reject("歌手名称不能为空");
        return Promise.resolve();
      },
      trigger: "blur",
    },
  };

  return rules;
}

export function createStyleRules() {
  const rules: IFormRules<ICreateMusicStyleDTO> = {
    name: {
      async validator(rule, field) {
        if (!field.value) return Promise.reject("风格名称不能为空");
        return Promise.resolve();
      },
      trigger: "blur",
    },
  };

  return rules;
}

export function createRegionRules() {
  const rules: IFormRules<ICreateMusicRegionDTO> = {
    name: {
      async validator(rule, field) {
        if (!field.value) return Promise.reject("地区名称不能为空");
        return Promise.resolve();
      },
      trigger: "blur",
    },
  };

  return rules;
}

export function createLanguageRules() {
  const rules: IFormRules<ICreateMusicLanguageDTO> = {
    name: {
      async validator(rule, field) {
        if (!field.value) return Promise.reject("语种名称不能为空");
        return Promise.resolve();
      },
      trigger: "blur",
    },
  };

  return rules;
}

export function createTagRules() {
  const rules: IFormRules<ICreateMusicTagDTO> = {
    name: {
      async validator(rule, field) {
        if (!field.value) return Promise.reject("标签名称不能为空");
        return Promise.resolve();
      },
      trigger: "blur",
    },
  };

  return rules;
}
