import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, RmqOptions } from '@nestjs/microservices'
import { RMQ_WORKER_OPTIONS } from '@slibs/rmq'
import { GpuAppModule } from './gpu-app.module'

async function bootstrap() {
  const app = await NestFactory.create(GpuAppModule)
  await app.init() // init 해주어야 onModuleInit 동작함.

  const rmqOptions = app.get<Map<string, RmqOptions>>(RMQ_WORKER_OPTIONS)

  // connect microservice
  for (const key of rmqOptions.keys()) {
    app.connectMicroservice<MicroserviceOptions>(rmqOptions.get(key)!)
  }

  await app.startAllMicroservices()
}

bootstrap()
