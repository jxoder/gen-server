import { Module } from '@nestjs/common'
import { RmqModule } from '@slibs/rmq'
import { RMQ_NAME } from '@slibs/rmq/constans'

@Module({
  imports: [RmqModule.registerClient(RMQ_NAME.GPU_SERVICE)],
})
export class AiImageModule {}
