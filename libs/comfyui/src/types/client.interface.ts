import { Buffer } from 'buffer'
import {
  ComfyUIFileOutPutType,
  ComfyUIModelType,
  ComfyUIWorkflowType,
  IComfyUIWorkflowHistory,
} from './comfyui.interface'

export interface IComfyUIClient {
  readonly ID: string

  readonly isConnected: boolean

  connect(retryCount?: number, delay?: number): Promise<void>

  getModels(type: ComfyUIModelType): Promise<Array<string>>

  prompt(workflow: ComfyUIWorkflowType): Promise<{
    prompt_id: string
    number: number
    node_errors: unknown
  }>

  getHistory(
    promptId?: string,
  ): Promise<{ [promptId: string]: IComfyUIWorkflowHistory }>

  clearHistory(promptId?: string): Promise<void>

  getFileBuffer(
    filename: string,
    type: ComfyUIFileOutPutType,
    subfolder?: string,
  ): Promise<Buffer>

  freeVram(): Promise<void>

  interrupt(): Promise<void>
}
