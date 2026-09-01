export class ParticipantDirectory {
  private participants = new Map<string, string>()

  public add(id: string, name: string): this {
    this.participants.set(id, name)
    return this
  }

  public remove(id: string): void {
    this.participants.delete(id)
  }

  public nameOf(id: string): string | undefined {
    return this.participants.get(id)
  }

  get size(): number {
    return this.participants.size
  }
}
