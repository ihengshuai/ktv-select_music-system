import { IBaseDateTime, IBaseQuery } from "@/typings/common/common";

export interface IQueryMusicLanguageDTO extends IBaseQuery {}

export interface ICreateMusicLanguageDTO {
  name: string;
}

export interface IUpdateMusicLanguageDTO extends ICreateMusicLanguageDTO {}

export interface IMusicLanguageVO extends IBaseDateTime {
  id: number;
  name: string;
}
