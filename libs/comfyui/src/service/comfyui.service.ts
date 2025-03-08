import { Inject, Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventEmitter } from 'stream'
import { RawData } from 'ws'
import { COMFYUI_CLIENT_TOKEN } from '../client'
import {
  COMFY_UI_WS_MESSAGE_TYPE,
  ComfyUIWorkflowType,
  ComfyUIWsMessage,
  IComfyUIClient,
  IComfyUIWorkflowHistory,
} from '../types'

@Injectable()
export class ComfyUIService {
  private readonly logger = new Logger(this.constructor.name)
  private readonly eventEmitter = new EventEmitter()
  private isTryConnect = false

  constructor(
    @Inject(COMFYUI_CLIENT_TOKEN) private readonly comfyui: IComfyUIClient,
  ) {}

  async invoke(workflow: ComfyUIWorkflowType) {
    if (!this.comfyui.isConnected)
      throw new Error('ComfyUI Server is not working')

    // set client_id for listen message
    workflow['client_id'] = this.comfyui.ID

    const res = await this.comfyui.prompt(workflow)
    return new Promise((resolve, reject) => {
      this.eventEmitter.on('invoke.success', () => {
        this.comfyui
          .getHistory(res.prompt_id)
          .then(histories => {
            const history = histories?.[res.prompt_id]
            if (!history) {
              reject(Error(`not found history for prompt_id: ${res.prompt_id}`))
            }
            const files = this.getOutputsFromHistory(history)
            if (files.length === 0) reject(Error('not found any output files'))

            Promise.all(
              files.map(async file => {
                return this.comfyui.getFileBuffer(
                  file.filename,
                  file.type,
                  file.subfolder,
                )
              }),
            )
              .then(resolve)
              .catch(reject)
          })
          .catch(reject)
      })
    })
  }

  getOutputsFromHistory(history: IComfyUIWorkflowHistory) {
    return Object.values(history.outputs ?? {})
      .map(o => o.images)
      .flat()
  }

  @OnEvent('comfyui.message')
  async onMessage(data: RawData) {
    try {
      const parsed = JSON.parse(data.toString()) as ComfyUIWsMessage

      switch (parsed.type) {
        case COMFY_UI_WS_MESSAGE_TYPE.CRYSTOOLS_MONITOR:
        case COMFY_UI_WS_MESSAGE_TYPE.STATUS:
        case COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_START:
        case COMFY_UI_WS_MESSAGE_TYPE.EXECUTING:
        case COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_ERROR:
        case COMFY_UI_WS_MESSAGE_TYPE.PROGRESS:
        case COMFY_UI_WS_MESSAGE_TYPE.EXECUTED:
        case COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_CACHED:
          // this.logger.log(parsed)
          break
        case COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_SUCCESS:
          this.eventEmitter.emit('invoke.success', parsed.data)
          break
        default:
          this.logger.warn(
            `Unknown message type: ${(parsed as any)?.type}`,
            parsed,
          )
      }
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
