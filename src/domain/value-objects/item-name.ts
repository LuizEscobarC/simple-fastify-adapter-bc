import { MessageIsEmptyError } from '../../shared/errors/text-is-empty-error'
import { TextTooLongError } from '../../shared/errors/text-too-long-error'

export class ItemName {
  private constructor(readonly value: string) {}

  private static sanitazeItemName(itemName: string): void {
    if (itemName?.length === 0) throw new MessageIsEmptyError()

    if (itemName.length > 20) throw new TextTooLongError()
  }

  static create(raw: string): ItemName {
    const trimmed = raw?.trim() ?? ''
    this.sanitazeItemName(trimmed)
    return new ItemName(trimmed)
  }
}
