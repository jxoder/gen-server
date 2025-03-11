import { Logger } from '@nestjs/common'
import { createTransport } from 'nodemailer'
import { IGmailConfig } from '../config'
import { IMailerClient } from '../types'

export class GmailClient implements IMailerClient {
  readonly logger = new Logger(this.constructor.name)

  constructor(private readonly config: IGmailConfig) {}

  async send(to: string, subject: string, text: string) {
    const transport = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: { user: this.config.GMAIL_USER, pass: this.config.GMAIL_PASSWORD },
    })

    await new Promise((resolve, reject) => {
      transport.sendMail(
        {
          from: this.config.FROM,
          to,
          subject,
          text,
        },
        (err, info) => {
          if (err) return reject(err)
          resolve(info)
        },
      )
    })
  }
}
