import { RmqOptions } from '@nestjs/microservices'

export const RMQ_NAME = {
  GPU_SERVICE: 'GPU_SERVICE', // gpu 서버만 consume 하는 큐 (example. ai 관련)
  GPU_SERVICE_COMPLETE: 'GPU_SERVICE_COMPLETE', // gpu 서버에서 처리 완료된 메시지를 전달하는 큐
  DLX_GPU_SERVICE: 'DLX_GPU_SERVICE', // gpu 서버에서 처리 안된 메시지를 전달하는 큐
  GPU_API_SERVICE: 'GPU_API_SERVICE', // 메세지 패턴으로 gpu 서버에 전달하는 큐
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
      headers: {
        dlx: RMQ_NAME.DLX_GPU_SERVICE,
        completion: RMQ_NAME.GPU_SERVICE_COMPLETE,
      },
    },
  },
  [RMQ_NAME.GPU_SERVICE_COMPLETE]: {
    name: RMQ_NAME.GPU_SERVICE_COMPLETE,
    options: {
      noAck: false,
      queueOptions: {
        durable: true,
      },
      persistent: true,
    },
  },
  [RMQ_NAME.DLX_GPU_SERVICE]: {
    name: RMQ_NAME.DLX_GPU_SERVICE,
    options: {
      noAck: false,
      queueOptions: {
        durable: true,
      },
      persistent: true,
    },
  },
  [RMQ_NAME.GPU_API_SERVICE]: {
    name: RMQ_NAME.GPU_API_SERVICE,
    options: {
      noAck: false,
      queueOptions: {
        messageTtl: 5 * 1000,
      },
    },
  },
} as const

export type RmqQueueType = (typeof RMQ_QUEUE)[keyof typeof RMQ_QUEUE]
