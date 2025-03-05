import { Inject } from '@nestjs/common'
import { RmqNameType } from '../constans'

// type: ClientProxy (nestjs/microservices)
export function InjectRmqClient(queueName: RmqNameType): ParameterDecorator {
  return Inject(queueName)
}
