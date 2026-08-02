import { IBaseDateTime, IBaseQuery } from "@/typings/common/common";

export interface IQueryMusicRegionDTO extends IBaseQuery {}

export interface ICreateMusicRegionDTO {
  name: string;
}

export interface IUpdateMusicRegionDTO extends ICreateMusicRegionDTO {}

export interface IMusicRegionVO extends IBaseDateTime {
  id: number;
  name: string;
}
