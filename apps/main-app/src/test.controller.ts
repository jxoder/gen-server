import { Controller, Inject, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Controller('test')
export class TestController {
  constructor(@Inject('GPU_SERVICE') private readonly proxy: ClientProxy) {}

  @Post()
  async test() {
    const res = await this.proxy.send('test', {
      prompt: 'a photo of a beautiful girl',
    })
    console.log(await lastValueFrom(res))
  }
}
