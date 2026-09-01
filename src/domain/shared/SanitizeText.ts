import { MessageIsEmptyError } from '../../shared/errors/text-is-empty-error'
import { TextTooLongError } from '../../shared/errors/text-too-long-error'

export class SanitazeText {
  static readonly MAX_LENGTH = 280
  public static sanitazeText(text: string): string {
    const trimmed = (text ?? '').trim()
    if (trimmed.length === 0) throw new MessageIsEmptyError()
    if (text.length > SanitazeText.MAX_LENGTH) throw new TextTooLongError()

    return trimmed
  }

  public static trimText(text: string): string {
    return (text ?? '').trim()
  }
}
