import { SetMetadata } from "@nestjs/common";

import { DECORATOR_SYMBOL, USER_ROLE } from "@/consts";

/** 表示该路由需要认证 */
export const RegisterAuthenticationController = () => SetMetadata(DECORATOR_SYMBOL.AUTHENTICATION_CONTROLLER, true);

/** 用户角色 */
export const Role = (...roles: USER_ROLE[]) => SetMetadata(DECORATOR_SYMBOL.USER_ROLE_LABEL, roles);

/** 公共访问 */
export const IsPublic = () => SetMetadata(DECORATOR_SYMBOL.IS_PUBLIC, true);
