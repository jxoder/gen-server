import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, RmqOptions, Transport } from '@nestjs/microservices'
import {
  IRmqClientConfig,
  IRmqWorkerConfig,
  RMQ_CLIENT_CONFIG_KEY,
  RMQ_WORKER_CONFIG_KEY,
  rmqClientConfig,
  rmqWorkerConfig,
} from './config'
import { RmqNameType } from './constans'

export const RMQ_WORKER_OPTIONS = 'RMQ_WORKER_OPTIONS'

@Module({})
export class RmqModule {
  static registerClient(queueName: RmqNameType): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ConfigModule.forFeature(rmqClientConfig),
        ClientsModule.registerAsync([
          {
            name: queueName,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const config = configService.getOrThrow<IRmqClientConfig>(
                RMQ_CLIENT_CONFIG_KEY,
              )
              return {
                transport: Transport.RMQ,
                options: {
                  urls: config.URLS,
                  queue: queueName,
                },
              }
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    }
  }

  static registerWorker(queueName: RmqNameType): DynamicModule {
    return {
      module: this,
      imports: [ConfigModule.forFeature(rmqWorkerConfig)],
      providers: [
        {
          provide: RMQ_WORKER_OPTIONS,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const config = configService.getOrThrow<IRmqWorkerConfig>(
              RMQ_WORKER_CONFIG_KEY,
            )
            return {
              transport: Transport.RMQ,
              options: {
                urls: config.URLS,
                queue: queueName,
                prefetchCount: config.PREFETCH_COUNT, // concurrency
                noAck: false, // 명시적으로 false 선언해야 ack 전송시 406 에러 안남.
                queueOptions: { durable: true }, // is disk persistence

                // TODO: serializer 와 deserializer 를 사용하여 메시지 직렬화 및 역직렬화 처리하여 안정성 확보하기
                // serializer: {
                //   serialize: (value: any) => {
                //     console.log(value)
                //     return value
                //   },
                // },
                // deserializer: {
                //   deserialize(value, options) {
                //     console.log(value)
                //     return value
                //   },
                // },
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
