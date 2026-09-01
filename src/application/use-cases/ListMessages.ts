import { Message, NoticeBoard } from '../../domain/NoticeBoard'
import { Clock } from '../ports/Clock'

export interface ListMessagesInterface {
  execute(limit?: number): Message[]
}
export class ListMessages implements ListMessagesInterface {
  public constructor(protected readonly noticeBoard: NoticeBoard) {}

  public execute(limit?: number): Message[] {
    let recentMessages = this.noticeBoard.recentMessages(limit ?? undefined)

    return recentMessages ?? []
  }
}
