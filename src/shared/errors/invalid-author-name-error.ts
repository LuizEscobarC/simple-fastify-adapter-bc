export class InvalidAuthorNameError extends Error {
  private readonly code = 'INVALID_AUTHOR_NAME'

  public constructor() {
    super('Nome do autor inválido.')
  }
}
