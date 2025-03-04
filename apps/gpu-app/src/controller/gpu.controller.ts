import { Controller } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import * as amqplib from 'amqplib'

@Controller()
export class GpuController {
  @MessagePattern('test')
  async handleTest(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('메시지 수신:', data)
    await new Promise(resolve => setTimeout(resolve, 300))

    // 메시지 처리 로직

    // 처리가 완료된 후 ack 수행
    const channel: amqplib.Channel = context.getChannelRef()
    const originalMessage = context.getMessage() as amqplib.ConsumeMessage
    channel.ack(originalMessage)
    console.log('메시지 처리 완료')

    return { ok: data }
  }
}
