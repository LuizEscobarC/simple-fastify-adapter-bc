import { Message, NoticeBoard } from '../../domain/NoticeBoard'
import { Clock } from '../ports/Clock'

export class ListMessages {
  public constructor(protected readonly noticeBoard: NoticeBoard) {}

  public execute(limit?: number): Message[] {
    let recentMessages = this.noticeBoard.recentMessages(limit ?? undefined)

    return recentMessages ?? []
  }
}
