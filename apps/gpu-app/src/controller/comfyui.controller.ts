import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import { ComfyUIService, ComfyWorkflowType } from '@slibs/comfyui'
import { RmqConsumerController } from '@slibs/rmq'

@Controller()
export class ComfyUIController extends RmqConsumerController {
  constructor(private readonly comfyuiService: ComfyUIService) {
    super()
  }

  @EventPattern('comfyui.invoke')
  async generateImage(
    @Payload() data: { type: ComfyWorkflowType; payload: any },
    @Ctx() context: RmqContext,
  ) {
    try {
      console.log('run process')

      await new Promise(resolve => setTimeout(resolve, 1500))

      //   const prompt = await ComfyWorkflow.get(data.type, data.payload)
      //   const res = await this.comfyuiService.invoke(prompt)

      //   // TODO: save image to storage
      //   console.log(res)

      this.ack(context, { ok: 'ok' })
    } catch (ex) {
      this.logger.error(ex)
      this.reject(context, ex)
    }
  }
}
