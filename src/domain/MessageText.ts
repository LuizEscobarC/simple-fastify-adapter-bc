import { SanitazeText } from './shared/SanitizeText'

export class MessageText {
  private constructor(readonly value: string) {}

  public static create(raw: string): MessageText {
    const messageSanitazed = SanitazeText.sanitazeText(raw)
    return new MessageText(messageSanitazed)
  }
}
