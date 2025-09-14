import { IsEnum } from "class-validator";

import { USER_ROLE } from "@/constants";

export class ChangeUserRoleDTO {
  @IsEnum(USER_ROLE)
  level: USER_ROLE;
}
