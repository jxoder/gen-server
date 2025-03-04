import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, RmqOptions } from '@nestjs/microservices'
import { RMQ_WORKER_OPTIONS } from '@slibs/rmq'
import { GpuAppModule } from './gpu-app.module'

async function bootstrap() {
  const app = await NestFactory.create(GpuAppModule)
  const rmqOptions = app.get<RmqOptions>(RMQ_WORKER_OPTIONS)

  // connect microservice
  app.connectMicroservice<MicroserviceOptions>(rmqOptions)

  await app.startAllMicroservices()
}

bootstrap()
