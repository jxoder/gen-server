import { Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRmqClient, RMQ_NAME } from '@slibs/rmq'

@Injectable()
export class AiImageService {
  constructor(
    @InjectRmqClient(RMQ_NAME.GPU_SERVICE)
    private readonly gpuQueue: ClientProxy,
  ) {}

  async create(input: { prompt: string }) {
    const { prompt } = input

    await prompt

    // TODO: 이미지 생성 gpuQueue.emit(MESSAGE_PATTERN.CREATE_COMFY, { ...input })
  }
}
