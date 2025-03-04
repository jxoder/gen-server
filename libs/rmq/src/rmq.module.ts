import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'GPU_SERVICE',
        useFactory: () => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://admin:password@localhost:5672'],
              queue: 'gpu',
            },
          }
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RmqModule {}
