import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { RandomUtils } from '@slibs/common'
import * as fs from 'fs/promises'
import path from 'path'
import {
  COMFY_UI_WS_MESSAGE_TYPE,
  ComfyUIFileOutPutType,
  ComfyUIModelType,
  ComfyUIWorkflowType,
  IComfyUIClient,
  IComfyUIWorkflowHistory,
} from '../types'

@Injectable()
export class MockComfyUIClient implements IComfyUIClient {
  constructor(private readonly eventEmitter: EventEmitter2) {
    setInterval(() => {
      this.eventEmitter.emit(
        'comfyui.message',
        JSON.stringify({ type: COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_SUCCESS }),
      )
    }, 1000)
  }

  readonly ID = 'mock-client'

  get isConnected() {
    return true
  }

  async connect(_retryCount = 3, _delay = 1000) {
    return
  }

  async getModels(_type: ComfyUIModelType) {
    return []
  }

  async prompt(_workflow: ComfyUIWorkflowType) {
    return {
      prompt_id: RandomUtils.uuidV4(),
      number: 1,
      node_errors: null,
    }
  }

  async getHistory(
    promptId?: string,
  ): Promise<{ [promptId: string]: IComfyUIWorkflowHistory }> {
    const id = promptId ?? RandomUtils.uuidV4()
    return {
      [id]: {
        prompt: [0, id, {}],
        outputs: {
          ['1']: {
            images: [{ type: 'output', filename: 'sample.jpg', subfolder: '' }],
          },
        },
        status: {
          status_str: 'complete',
          completed: true,
          messages: [],
        },
      },
    }
  }

  async clearHistory(_promptId?: string) {
    return
  }

  async getFileBuffer(
    _filename: string,
    _type: ComfyUIFileOutPutType,
    _subfolder?: string,
  ) {
    return fs.readFile(path.join(process.cwd(), 'static', 'sample.jpg'))
  }

  async freeVram() {}

  async interrupt() {}
}
