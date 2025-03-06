import { Controller, Inject, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Controller('test')
export class TestController {
  constructor(@Inject('GPU_SERVICE') private readonly proxy: ClientProxy) {}

  @Post()
  async test() {
    // const res = await this.proxy
    //   .send('test', {
    //     prompt: 'a photo of a beautiful girl',
    //   })
    //   .pipe(
    //     timeout(5000),
    //     catchError(err => {
    //       throw new err()
    //     }),
    //   )
    // console.log(await lastValueFrom(res))

    await this.proxy.emit('test', {
      prompt: 'a photo of a beautiful girl',
    })
    return { ok: 'ok' }
  }
}
