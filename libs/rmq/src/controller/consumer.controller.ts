import { Logger } from '@nestjs/common'
import { RmqContext } from '@nestjs/microservices'
import * as amqplib from 'amqplib'
export abstract class RmqConsumerController {
  protected logger = new Logger(this.constructor.name)

  async ack(ctx: RmqContext, result: any) {
    const channel: amqplib.Channel = ctx.getChannelRef()
    const originalMessage = ctx.getMessage() as amqplib.ConsumeMessage

    channel.ack(originalMessage)

    const completion = originalMessage.properties.headers?.['completion']

    if (completion) {
      channel.publish(
        originalMessage.fields.exchange,
        completion,
        Buffer.from(JSON.stringify(result)),
      )
    }
  }

  async reject(ctx: RmqContext, ex: any, retry: number = 2) {
    const channel: amqplib.Channel = ctx.getChannelRef()
    const originalMessage = ctx.getMessage() as amqplib.ConsumeMessage

    const tryCount = (originalMessage.properties.headers?.['x-retry'] ?? 0) + 1

    channel.reject(originalMessage, false)

    if (retry > tryCount) {
      channel.publish(
        originalMessage.fields.exchange,
        originalMessage.fields.routingKey,
        originalMessage.content,
        {
          headers: {
            ...originalMessage.properties.headers,
            ['x-retry']: tryCount,
          },
        },
      )
      return
    }

    const dlx = originalMessage.properties.headers?.['dlx']
    if (dlx) {
      channel.publish(
        originalMessage.fields.exchange,
        dlx,
        originalMessage.content,
        { headers: { error: ex.message } },
      )
    }
  }
}
