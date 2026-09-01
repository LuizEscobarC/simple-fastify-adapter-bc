export class Inbox {
  private readonly items: string[] = []
  constructor(private readonly historyLimit: number) {}

  post(item: string): void {
    this.items.push(item)
    while (this.items.length > this.historyLimit) this.items.shift()
  }

  recent(limit?: number): string[] {
    if (limit === undefined) return [...this.items]
    return this.items.slice(Math.max(0, this.items.length - limit))
  }
}
