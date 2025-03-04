import { Module } from '@nestjs/common'
import { RmqModule } from '@slibs/rmq'
import { GpuController } from './controller'

@Module({
  imports: [RmqModule.registerWorker('GPU_SERVICE')],
  controllers: [GpuController],
  providers: [],
})
export class GpuAppModule {}
