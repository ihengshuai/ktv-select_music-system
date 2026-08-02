import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { APP_CONFIG, IConfig } from "@/config";

export * from "./list-response.schema";
export * from "./model-response.schema";

export const initSwagger = (app: NestExpressApplication) => {
  const config = app.get(ConfigService<IConfig>);

  const title = config.get("APP_CONFIG.APP_TITLE");

  const swaggerConfig = new DocumentBuilder()
    .setTitle(title)
    // .addSecurity('basic', { type: 'http', scheme: 'basic' })
    // .addGlobalParameters({ name: "Cookie", in: "header", required: true })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    // include: [MockController],
    operationIdFactory: (controllerKey, methodKey) => `${controllerKey}___${methodKey}`,
  });

  // 过滤掉不是以 `APP_CONFIG.API_PREFIX 开头` 和 没有 `@ApiTags` 装饰的接口
  document.paths = Object.keys(document.paths).reduce((paths, path) => {
    const regexp = new RegExp(`^${APP_CONFIG.API_PREFIX}`);
    if (!regexp.test(path)) return paths; // 只生成api开头的接口

    const pathItem = document.paths[path];
    const filteredOperations = Object.keys(pathItem).reduce((ops, method) => {
      const operation = pathItem[method];
      if (operation.tags && operation.tags.length > 0) {
        return { ...ops, [method]: operation };
      }
      return ops;
    }, {});

    if (Object.keys(filteredOperations).length > 0) {
      return { ...paths, [path]: filteredOperations };
    }
    return paths;
  }, {});

  SwaggerModule.setup(`${APP_CONFIG.API_PREFIX}/swagger-ui.html`, app, document, {
    customSiteTitle: title + " API Docs",
    swaggerOptions: {
      docExpansion: "none", // 默认不展开文档
      requestInterceptor: req => {
        req.headers["x-from-swagger"] = true;

        return req;
      },
    },
  });
};
