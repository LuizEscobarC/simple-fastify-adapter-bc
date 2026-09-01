import { SanitazeText } from './shared/SanitizeText'

export interface MessageTextInterface {
  value: string
}

export class MessageText implements MessageTextInterface {
  private constructor(readonly value: string = '') {}

  public static create(raw: string): MessageText {
    const messageSanitazed = SanitazeText.sanitazeText(raw)
    return new MessageText(messageSanitazed)
  }
}
