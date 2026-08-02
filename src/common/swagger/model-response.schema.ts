import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

/**
 * 用于定义通用模型响应
 */
export const ApiModelResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              code: { type: "number", example: 200 },
              message: { type: "string", example: "success" },
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    })
  );
};
