import { FileType } from "@/constants/static";

export class IStaticBase {
  appId?: string;
  title?: string;
  remark?: string;
  type: FileType;
}

export class IStaticDTO extends IStaticBase {
  file: File;
}

export class IStaticVO extends IStaticBase {
  url: string;
  id: number;
}
