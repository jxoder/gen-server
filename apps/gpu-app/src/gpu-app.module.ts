import { Module } from '@nestjs/common'
import { ComfyUIModule } from '@slibs/comfyui'
import { CommonModule } from '@slibs/common'
import { RMQ_QUEUE, RmqModule } from '@slibs/rmq'
import { GpuController } from './controller'

@Module({
  imports: [
    CommonModule,
    RmqModule.registerWorker(RMQ_QUEUE.GPU_SERVICE),
    ComfyUIModule,
  ],
  controllers: [GpuController],
  providers: [],
})
export class GpuAppModule {}
