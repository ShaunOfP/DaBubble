export interface Message {
  id: string,
  sender: string,
  createdAt: number,
  content: string,
  userId: string,
  reaction?: Record<string, string[]>,
  avatar: string
}
