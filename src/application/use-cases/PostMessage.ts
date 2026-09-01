import { MessageText } from '../../domain/MessageText'
import { Message, NoticeBoard } from '../../domain/NoticeBoard'
import { Broadcaster } from '../ports/Broadcaster'
import { Clock } from '../ports/Clock'

export class PostMessage {
  public constructor(
    protected readonly noticeBoard: NoticeBoard,
    protected readonly clock: Clock,
    protected readonly broadcaster: Broadcaster
  ) {}

  public execute(message: Message) {
    let postedAt = this.clock.postedAt
    let messageValidated = MessageText.create(message.text).value
    let noticeBoard = this.noticeBoard.post({ ...message, text: messageValidated, postedAt })
    const recentMessages = noticeBoard.recentMessages()
    this.broadcaster.broadcast('message', recentMessages[recentMessages.length - 1])
    return noticeBoard.recentMessages()
  }
}
