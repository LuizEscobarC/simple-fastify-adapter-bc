export class TextTooLongError extends Error {
  private readonly code = 'TEXT_TOO_LONG'

  public constructor() {
    super('Texto muito longo.')
  }
}
