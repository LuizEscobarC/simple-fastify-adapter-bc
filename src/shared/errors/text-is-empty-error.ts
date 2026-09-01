export class MessageIsEmptyError extends Error {
  private readonly code = 'EMPTY_MESSAGE'

  public constructor() {
    super('Texto inválido.')
  }

  get getCode() {
    return this.code
  }
}
