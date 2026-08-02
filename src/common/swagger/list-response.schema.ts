import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from "@nestjs/swagger";

class PagerDTO {
  @ApiProperty({ description: "页码", required: false, example: 1 })
  readonly page: number;

  @ApiProperty({ required: false, description: "每页数量", example: 10 })
  readonly size: number;

  @ApiProperty({ required: false, description: "总数", example: 10 })
  total?: number;
}

// eslint-disable-next-line no-unused-vars
class ListResponseDTO<T> {
  @ApiProperty({ type: PagerDTO })
  pager: PagerDTO;

  @ApiProperty({ isArray: true })
  list: T[];
}

/**
 * 用于定义通用列表响应
 */
export const ApiListResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiExtraModels(PagerDTO),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              code: { type: "number", example: 200 },
              message: { type: "string", example: "success" },
              data: {
                type: "object",
                properties: {
                  pager: { $ref: getSchemaPath(PagerDTO) },
                  list: {
                    type: "array",
                    items: { $ref: getSchemaPath(model) },
                  },
                },
              },
            },
          },
        ],
      },
    })
  );
};
