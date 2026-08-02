/** class-validator 校验错误 */
export class ValidatorException extends Error {
  constructor(message: string) {
    super(message);

    this.name = "ValidatorException";
  }
}
