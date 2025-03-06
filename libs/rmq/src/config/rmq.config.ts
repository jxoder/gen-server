import { registerAs } from '@nestjs/config'
import { get } from 'env-var'

export const RMQ_CONFIG_KEY = `rmq`

export interface IRmqConfig {
  URLS: Array<string>
}

export const rmqConfig = registerAs<IRmqConfig>(RMQ_CONFIG_KEY, () => ({
  URLS: get('URLS').default('amqp://admin:password@localhost:5672').asArray(),
}))
