import { Module } from '@nestjs/common'
import { RMQ_NAME, RmqModule } from '@slibs/rmq'

@Module({})
export class AiImageModule {
  static publisher() {
    return {
      module: this,
      imports: [RmqModule.registerClient(RMQ_NAME.GPU_SERVICE)],
    }
  }

  static consumer() {
    return {
      module: this,
      imports: [],
    }
  }
}
