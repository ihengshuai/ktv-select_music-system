import { IBaseDateTime, IBaseQuery } from "@/typings/common/common";

export interface IQueryMusicTagDTO extends IBaseQuery {}

export interface ICreateMusicTagDTO {
  name: string;
}

export interface IUpdateMusicTagDTO extends ICreateMusicTagDTO {}

export interface IMusicTagVO extends IBaseDateTime {
  id: number;
  name: string;
}
