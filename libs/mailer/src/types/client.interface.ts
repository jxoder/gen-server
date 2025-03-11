export interface IMailerClient {
  send(to: string, subject: string, text: string): Promise<void>
}
