import { SetMetadata } from "@nestjs/common";

import { DecoratorSymbol, USER_ROLE } from "@/constants";

/** 表示该路由需要认证 */
export const RegisterAuthenticationController = () => SetMetadata(DecoratorSymbol.AUTHENTICATION_CONTROLLER, true);

/** 用户角色 */
export const Role = (...roles: USER_ROLE[]) => SetMetadata(DecoratorSymbol.USER_ROLE_LABEL, roles);

/** 公共访问 */
export const IsPublic = () => SetMetadata(DecoratorSymbol.IS_PUBLIC, true);
