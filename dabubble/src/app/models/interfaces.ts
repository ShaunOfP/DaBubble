export interface Message {
  uniqueId: string,
  createdAt: number,
  content: string,
  userId: string,
  reaction?: Record<string, string[]>,
  threadAnswers: number
}

export interface Channel {
  channelId: string,
  channelName: string,
  createdAt: number,
  description: string,
  owner: string,
  users: string[]
}