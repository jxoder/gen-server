import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices'
import { IRmqConfig, RMQ_CONFIG_KEY, rmqConfig } from './config'
import { RmqQueueType } from './constans'

export const RMQ_WORKER_OPTIONS = 'RMQ_WORKER_OPTIONS'

@Module({})
export class RmqModule {
  static registerClient(queue: RmqQueueType): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ConfigModule.forFeature(rmqConfig),
        ClientsModule.registerAsync([
          {
            name: queue.name,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const config =
                configService.getOrThrow<IRmqConfig>(RMQ_CONFIG_KEY)
              return {
                transport: Transport.RMQ,
                options: {
                  ...queue.options,
                  urls: config.URLS,
                  queue: queue.name,
                  noAck: true, // 명시적으로 true 선언해야 ack 전송시 406 에러 안남.
                },
              }
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    }
  }

  static registerWorker(queue: RmqQueueType): DynamicModule {
    return {
      module: this,
      imports: [ConfigModule.forFeature(rmqConfig)],
      providers: [
        {
          provide: RMQ_WORKER_OPTIONS,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const config = configService.getOrThrow<IRmqConfig>(RMQ_CONFIG_KEY)
            return {
              transport: Transport.RMQ,
              options: {
                ...queue.options,
                urls: config.URLS,
                queue: queue.name,
              },
            } as RmqOptions
          },
        },
      ],
      exports: [
        { provide: RMQ_WORKER_OPTIONS, useExisting: RMQ_WORKER_OPTIONS },
      ],
    }
  }
}
