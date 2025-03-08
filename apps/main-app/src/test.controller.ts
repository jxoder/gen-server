import { Controller, Inject, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Controller('test')
export class TestController {
  constructor(@Inject('GPU_SERVICE') private readonly proxy: ClientProxy) {}

  @Post()
  async test() {
    await this.proxy.emit('comfyui.invoke', {
      type: 'SDXL_BASIC',
      payload: {
        model: 'SDXL',
        prompt: 'a photo of a beautiful girl',
        negativePrompt: 'low quality, worst quality',
      },
    })

    return { ok: 'ok' }
  }
}
