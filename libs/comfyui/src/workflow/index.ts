import { SDXLBasicWorkflow } from './sdxl-basic.workflow'
export * from './comfy-workflow.base'

const COMFY_WORKFLOWS = {
  SDXL_BASIC: new SDXLBasicWorkflow(),
} as const

export class ComfyWorkflow {
  static async get(type: keyof typeof COMFY_WORKFLOWS, payload: any) {
    if (!COMFY_WORKFLOWS[type]) {
      throw new Error(`Invalid workflow type: ${type}`)
    }

    return COMFY_WORKFLOWS[type].prompt(payload)
  }
}

export type ComfyWorkflowType = keyof typeof COMFY_WORKFLOWS
