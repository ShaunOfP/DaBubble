export interface Message {
  uniqueId: string,
  sender: string,
  createdAt: number,
  content: string,
  userId: string,
  reaction?: Record<string, string[]>,
  avatar: string,
  threadAnswers: number
}
