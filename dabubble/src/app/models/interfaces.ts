export interface Message {
  uniqueId: string,
  createdAt: number,
  content: string,
  userId: string,
  reaction?: Record<string, string[]>,
  threadAnswers: number
}