import { IBaseDateTime, IBaseQuery } from "@/typings/common/common";

export interface IQueryMusicStyleDTO extends IBaseQuery {}

export interface ICreateMusicStyleDTO {
  name: string;
}

export interface IUpdateMusicStyleDTO extends ICreateMusicStyleDTO {}

export interface IMusicStyleVO extends IBaseDateTime {
  id: number;
  name: string;
}
