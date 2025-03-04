import { registerAs } from '@nestjs/config'
import { get } from 'env-var'

export const RMQ_CLIENT_CONFIG_KEY = `rmq-client`
export const RMQ_WORKER_CONFIG_KEY = `rmq-worker`

export interface IRmqClientConfig {
  URLS: Array<string>
}

export interface IRmqWorkerConfig extends IRmqClientConfig {
  PREFETCH_COUNT?: number // 동시에 처리할 메세지 개수
}

export const rmqClientConfig = registerAs<IRmqClientConfig>(
  RMQ_CLIENT_CONFIG_KEY,
  () => ({
    URLS: get('URLS').default('amqp://admin:password@localhost:5672').asArray(),
  }),
)

export const rmqWorkerConfig = registerAs<IRmqWorkerConfig>(
  RMQ_WORKER_CONFIG_KEY,
  () => ({
    URLS: get('URLS').default('amqp://admin:password@localhost:5672').asArray(),
    QUEUE_NAME: get('QUEUE_NAME').default('').asString(),
    PREFETCH_COUNT: get('PREFETCH_COUNT').default(1).asIntPositive(),
  }),
)
