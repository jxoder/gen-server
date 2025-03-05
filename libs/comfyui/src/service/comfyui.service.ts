import { Inject, Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { RawData } from 'ws'
import { COMFYUI_CLIENT_TOKEN, ComfyUIClient } from '../client'

@Injectable()
export class ComfyUIService {
  private readonly logger = new Logger(this.constructor.name)
  private isTryConnect = false

  constructor(
    @Inject(COMFYUI_CLIENT_TOKEN) private readonly comfyui: ComfyUIClient,
  ) {}

  // TODO: 수정 필요.
  async t() {
    if (!this.comfyui.isConnected) {
      return 'Failed'
    }

    return 'Success'
  }

  @OnEvent('comfyui.message')
  async onMessage(data: RawData) {
    try {
      const parsed = JSON.parse(data.toString())
      if (parsed.type === 'crystools.monitor') {
        return
      }

      this.logger.log(parsed)
    } catch {
      // TODO: binary data (일반적으로 생성중인 이미지 preview 데이터)
    }
  }

  @OnEvent('comfyui.close')
  async onClose(msg: string) {
    // Connect 시도 실패할때 마다 이벤트 발생되어 다중 시도 방지.
    if (this.isTryConnect) {
      return
    }

    this.isTryConnect = true
    this.logger.error(msg)
    try {
      await this.comfyui.connect(10, 1000)
    } catch (ex: any) {
      this.logger.error(ex)
    } finally {
      this.isTryConnect = false
    }
  }
}
