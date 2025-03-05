import { Logger } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { catchError, defer, lastValueFrom, retry, timer } from 'rxjs'
import { WebSocket } from 'ws'
import { ComfyUIWsEvent } from '../types'

export const COMFYUI_CLIENT_TOKEN = 'COMFYUI_CLIENT_TOKEN'

export class ComfyUIClient {
  private logger = new Logger(this.constructor.name)
  protected ws?: WebSocket
  readonly ID: string

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly options: { host: string; port: number },
  ) {
    this.ID = 'random-id'
  }

  get isConnected() {
    return !!this.ws
  }

  async ensureConnect() {
    if (this.isConnected) {
      return
    }
    await this.connect()
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
      `ws://${this.options.host}:${this.options.port}/ws?client_id=${this.ID}`,
    )

    await new Promise((resolve, reject) => {
      socket.on('open', () => {
        this.ws = socket
        this.logger.log('Connected to ComfyUI')
        this.emit('comfyui.message', 'ok')
        resolve(null)
      })

      socket.on('close', () => {
        this.ws = undefined
        this.logger.error('Disconnected from ComfyUI')
        reject(new Error('Disconnected from ComfyUI'))
      })

      socket.on('error', err => {
        this.logger.error('Error on ComfyUI', err)
        reject(err)
      })

      socket.on('message', data => {
        this.eventEmitter.emit('comfyui.message', data)
        console.log(this.emit('comfyui.message', data))
      })
    })
  }

  private emit(event: ComfyUIWsEvent, data: any) {
    return this.eventEmitter.emit(event, data)
  }

  @OnEvent('comfyui.message')
  onMessage(data: any) {
    console.log(data)
  }
}
