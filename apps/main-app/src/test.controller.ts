import { Controller, Inject, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

let index = 0
@Controller('test')
export class TestController {
  constructor(@Inject('GPU_SERVICE') private readonly proxy: ClientProxy) {}

  @Post()
  async test() {
    const message = `index: ${index++}`
    const result = await this.proxy.send('test', {
      message,
    })

    try {
      console.log('마이크로서비스 응답:', await lastValueFrom(result))
    } catch (ex) {
      console.error(ex)
    }
    // await this.proxy.emit('test', {
    //   message,
    // })
  }
}
