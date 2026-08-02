import { FILE_LOCATION, FILE_TYPE } from "@/constants/file";

export class IStaticBase {
  appId?: string;
  title?: string;
  remark?: string;
  type: FILE_TYPE;
  location: FILE_LOCATION;
}

export class IStaticDTO extends IStaticBase {
  file: File;
}

export class IStaticVO extends IStaticBase {
  url: string;
  id: number;
  uid: string;
  fileName: string;
}

export class IStaticQueryDTO {
  keywords?: string;
  location?: FILE_LOCATION;
  type?: FILE_TYPE;
}
