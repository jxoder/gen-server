import { Logger } from '@nestjs/common'
import { IMailerClient } from '../types'

export class MockMailerClient implements IMailerClient {
  readonly logger = new Logger(this.constructor.name)

  async send(to: string, subject: string, text: string) {
    this.logger.log(`to: ${to}, subject: ${subject}, text: ${text}`)
  }
}
