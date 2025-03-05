import { Inject, Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { RawData } from 'ws'
import { COMFYUI_CLIENT_TOKEN, ComfyUIClient } from '../client'

@Injectable()
export class ComfyUIService {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    @Inject(COMFYUI_CLIENT_TOKEN) private readonly comfyui: ComfyUIClient,
  ) {}

  async t() {
    await this.comfyui.ensureConnect()

    console.log('connected')
  }

  @OnEvent('comfyui.message')
  async onMessage(data: RawData) {
    this.logger.log(`Received message from ComfyUI: ${data}`)
  }
}
