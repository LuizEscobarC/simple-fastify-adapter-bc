import { MessageIsEmptyError } from '../shared/errors/text-is-empty-error'
import { TextTooLongError } from '../shared/errors/text-too-long-error'
import { MessageText } from './MessageText'
import { SanitazeText } from './shared/SanitizeText'

export interface Message {
  author: string
  text: string
  postedAt?: Date
}

export class NoticeBoard {
  private readonly messages: Message[] = []
  public constructor(readonly historyLimit: number) {}

  public post(message: Message): NoticeBoard {
    const authorSanitized = SanitazeText.trimText(message.author)
    const messageSanitazed = SanitazeText.trimText(message.text)

    const newMessage = {
      author: authorSanitized,
      text: messageSanitazed,
      postedAt: message.postedAt
    }
    this.messages.push(newMessage)
    while (this.messages.length > this.historyLimit) this.messages.shift()
    return this
  }

  public recentMessages(limit?: number): Message[] {
    if (limit === undefined) return [...this.messages]
    return this.messages.slice(Math.max(0, this.messages.length - limit))
  }
}
