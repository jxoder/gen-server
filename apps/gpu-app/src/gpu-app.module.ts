import { Module } from '@nestjs/common'
import { GpuController } from './controller'

@Module({
  controllers: [GpuController],
  providers: [],
})
export class GpuAppModule {}
