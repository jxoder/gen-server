type WS_EVENT_NAME = 'open' | 'close' | 'error' | 'message'

export type ComfyUIWsEvent = `comfyui.${WS_EVENT_NAME}`

/**
 * ComfyUI Interface
 */

type StringLikeNumber = string
export type ComfyUIModelType = 'checkpoint' | 'loras'
export type ComfyUIFileOutPutType = 'temp' | 'output'
export type ComfyUIFileType = {
  type: ComfyUIFileOutPutType
  filename: string
  subfolder: string
}

export type ComfyUIWorkflowType = any
export interface IComfyUIWorkflowHistory {
  prompt: [number, string, ComfyUIWorkflowType] // [index, prompt_id, workflow]
  outputs: { [node: StringLikeNumber]: { images: Array<ComfyUIFileType> } }
  status: {
    status_str: string
    completed: boolean
    messages: Array<[COMFY_UI_WS_MESSAGE_TYPE, any]>
  }
}

export enum COMFY_UI_WS_MESSAGE_TYPE {
  STATUS = 'status',
  EXECUTION_START = 'execution_start',
  EXECUTING = 'executing',
  EXECUTION_ERROR = 'execution_error',
  PROGRESS = 'progress',
  EXECUTED = 'executed',
  EXECUTION_SUCCESS = 'execution_success',
  EXECUTION_CACHED = 'execution_cached',

  //   ComfyUI Extention
  CRYSTOOLS_MONITOR = 'crystools.monitor',
}

interface IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE
}

export interface IComfyUIWsMessageStatus extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.STATUS
  data: {
    status: {
      exec_info: { queue_info: { queue_remaining: number } }
    }
    sid?: string
  }
}

export interface IComfyUIWsMessageExecutionStart extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_START
  data: { prompt_id: string; timestamp: number }
}

export interface IComfyUIWsMessageExecutionCached
  extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_CACHED
  data: { nodes: Array<StringLikeNumber>; prompt_id: string; timestamp: number }
}

export interface IComfyUIWsMessageCrystoolsMonitor
  extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.CRYSTOOLS_MONITOR
  data: {
    cpu_utilization: number
    ram_total: number
    ram_used: number
    ram_used_percent: number
    hdd_total: number
    hdd_used: number
    hdd_used_percent: number
    device_type: string // example. cuda
    gpus: [
      {
        gpu_utilization: number
        gpu_temperature: number
        vram_total: number
        vram_used: number
        vram_used_percent: number
      },
    ]
  }
}

export interface IComfyUIWsMessageExecuting extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.EXECUTING
  data: {
    node: StringLikeNumber | null // null 이면 완료.
    display_node?: StringLikeNumber
    prompt_id: string
  }
}

export interface IComfyUIWsMessageProgress extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.PROGRESS
  data: {
    value: number
    max: number
    prompt_id: string
    node: StringLikeNumber
  }
}

export interface IComfyUIWsMessageExecuted extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.EXECUTED
  data: {
    node: StringLikeNumber
    display_node: StringLikeNumber
    output: { images: Array<ComfyUIFileOutPutType> }
    prompt_id: string
  }
}

export interface IComfyUIWsMessageExecutionSuccess
  extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_SUCCESS
  data: {
    prompt_id: string
    timestamp: number
  }
}

export interface IComfyUIWsMessageExecutionError extends IComfyUIWsMessageBase {
  type: COMFY_UI_WS_MESSAGE_TYPE.EXECUTION_ERROR
  data: {
    prompt_id: string
    node_id: StringLikeNumber
    node_type: string
    executed: unknown // TODO
    exception_message: string
    exception_type: string
    traceback: string
  }
}

export type ComfyUIWsMessage =
  | IComfyUIWsMessageStatus
  | IComfyUIWsMessageExecutionStart
  | IComfyUIWsMessageExecutionCached
  | IComfyUIWsMessageCrystoolsMonitor
  | IComfyUIWsMessageExecuting
  | IComfyUIWsMessageProgress
  | IComfyUIWsMessageExecuted
  | IComfyUIWsMessageExecutionSuccess
  | IComfyUIWsMessageExecutionError
