import { Controller } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { ComfyUIService } from '@slibs/comfyui'
import * as amqplib from 'amqplib'

@Controller()
export class GpuController {
  constructor(private readonly comfyuiService: ComfyUIService) {}

  @MessagePattern('test')
  async handleTest(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel: amqplib.Channel = context.getChannelRef()
    const originalMessage = context.getMessage() as amqplib.ConsumeMessage
    try {
      console.log(`run process`)
      await new Promise(resolve => setTimeout(resolve, 3000))
      // const prompt = await ComfyWorkflow.get('SDXL_BASIC', data)
      // const res = await this.comfyuiService.invoke(prompt)

      // console.log(1414, res)

      // 메시지 처리 로직

      // 처리가 완료된 후 ack 수행

      channel.ack(originalMessage)

      return { ok: data }
    } catch (ex) {
      console.error(ex)
      channel.reject(originalMessage, false)
      throw ex
    }
  }
}
