import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { RandomUtils } from '@slibs/common'
import axios, { AxiosRequestConfig } from 'axios'
import { catchError, defer, lastValueFrom, retry, timer } from 'rxjs'
import { WebSocket } from 'ws'
import {
  ComfyUIFileOutPutType,
  ComfyUIModelType,
  ComfyUIWorkflowType,
  ComfyUIWsEvent,
  IComfyUIClient,
  IComfyUIWorkflowHistory,
} from '../types'

export const COMFYUI_CLIENT_TOKEN = 'COMFYUI_CLIENT_TOKEN'

@Injectable()
export class ComfyUIClient implements IComfyUIClient {
  private logger = new Logger(this.constructor.name)
  protected ws?: WebSocket
  readonly ID: string

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly options: { host: string; port: number },
  ) {
    this.ID = RandomUtils.uuidV4()
  }

  get isConnected() {
    return !!this.ws
  }

  async connect(retryCount = 3, delay = 1000) {
    await lastValueFrom(
      defer(() => this.connectToComfyUIServer()).pipe(
        retry({
          count: retryCount,
          delay: (error, retryCount) => {
            console.log(`Failed connect to ComfyUI: ${retryCount}`)
            return timer(delay * retryCount)
          },
        }),
        catchError(error => {
          console.log(`Failed connect to ComfyUI: ${error}`)
          throw error
        }),
      ),
    )
  }

  private async connectToComfyUIServer() {
    const socket = new WebSocket(
      `ws://${this.options.host}:${this.options.port}/ws?clientId=${this.ID}`,
    )

    await new Promise((resolve, reject) => {
      socket.on('open', () => {
        this.ws = socket
        this.logger.log('Connected to ComfyUI')
        resolve(null)
      })

      socket.on('close', () => {
        this.ws = undefined
        this.emit('comfyui.close', 'Disconnected from ComfyUI')
        reject(new Error('Disconnected from ComfyUI'))
      })

      socket.on('error', err => {
        this.logger.error('Error on ComfyUI', err)
        reject(err)
      })

      socket.on('message', data => {
        this.emit('comfyui.message', data)
      })
    })
  }

  async getModels(type: ComfyUIModelType) {
    return this.getAPI<Array<string>>(`/models/${type}`)
  }

  async prompt(workflow: ComfyUIWorkflowType) {
    return this.postAPI<{
      prompt_id: string
      number: number
      node_errors: unknown
    }>('/prompt', workflow)
  }

  async getHistory(promptId?: string) {
    const url = promptId ? `/history/${promptId}` : '/history'
    return this.getAPI<{ [promptId: string]: IComfyUIWorkflowHistory }>(url)
  }

  async clearHistory(promptId?: string) {
    const payload = promptId ? { prompt_id: promptId } : {}
    await this.postAPI('/history', payload)
  }

  async getFileBuffer(
    filename: string,
    type: ComfyUIFileOutPutType,
    subfolder?: string,
  ): Promise<Buffer> {
    return this.getAPI<Buffer>(
      `/view?filename=${filename}&type=${type}&subfolder=${subfolder ?? ''}`,
      { responseType: 'arraybuffer' },
    )
  }

  async freeVram(): Promise<void> {
    await this.postAPI('/free', { free_memory: true })
  }

  async interrupt(): Promise<void> {
    await this.postAPI('/interrupt', {})
  }

  private async emit(event: ComfyUIWsEvent, data: any) {
    this.eventEmitter.emit(event, data)
  }

  private async getAPI<RESPONSE>(url: string, config?: AxiosRequestConfig) {
    const res = await axios.get<RESPONSE>(
      `http://${this.options.host}:${this.options.port}${url}`,
      config,
    )
    return res.data
  }

  private async postAPI<RESPONSE, PAYLOAD = any>(
    url: string,
    data: PAYLOAD,
    config?: AxiosRequestConfig,
  ): Promise<RESPONSE> {
    const res = await axios.post<RESPONSE>(
      `http://${this.options.host}:${this.options.port}${url}`,
      data,
      config,
    )
    return res.data
  }
}
