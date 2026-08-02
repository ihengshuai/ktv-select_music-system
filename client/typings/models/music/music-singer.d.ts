import { IBaseDateTime, IBaseQuery } from "@/typings/common/common";

export interface IQueryMusicSingerDTO extends IBaseQuery {}

export interface ICreateMusicSingerDTO {
  name: string;
}

export interface IUpdateMusicSingerDTO extends ICreateMusicSingerDTO {}

export interface IMusicSingerVO extends IBaseDateTime {
  id: number;
  name: string;
}
