import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { GpuAppModule } from './gpu-app.module'

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   GpuAppModule,
  //   {
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: ['amqp://admin:password@localhost:5672'],
  //       queue: 'gpu',
  //       prefetchCount: 1,
  //       noAck: false, // 명시적으로 false 설정
  //       queueOptions: {
  //         durable: true,
  //       },
  //       // // 연결 안정성 개선을 위한 옵션
  //       // socketOptions: {
  //       //   heartbeatIntervalInSeconds: 5,
  //       // },
  //     },
  //   },
  // )
  // await app.listen()

  const app = await NestFactory.create(GpuAppModule)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:password@localhost:5672'],
      queue: 'gpu',
      prefetchCount: 1,
      noAck: false, // 명시적으로 false 설정
      queueOptions: {
        durable: true,
      },
    },
  })

  await app.startAllMicroservices()
}

bootstrap()
