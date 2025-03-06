import { RmqOptions } from '@nestjs/microservices'

export const RMQ_NAME = {
  GPU_SERVICE: 'GPU_SERVICE', // gpu 서버만 consume 하는 큐 (example. ai 관련)
} as const

export type RmqNameType = (typeof RMQ_NAME)[keyof typeof RMQ_NAME]

export const RMQ_QUEUE: Record<
  RmqNameType,
  { name: RmqNameType; options: RmqOptions['options'] }
> = {
  [RMQ_NAME.GPU_SERVICE]: {
    name: RMQ_NAME.GPU_SERVICE,
    options: {
      prefetchCount: 1,
      noAck: false,
      queueOptions: {
        durable: true,
      },
      persistent: true,
    },
  },
} as const

export type RmqQueueType = (typeof RMQ_QUEUE)[keyof typeof RMQ_QUEUE]
