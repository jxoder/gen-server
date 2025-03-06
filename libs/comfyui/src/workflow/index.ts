import { SDXLBasicWorkflow } from './sdxl-basic.workflow'
export * from './comfy-workflow.base'

const COMFY_WORKFLOWS = {
  SDXL_BASIC: new SDXLBasicWorkflow(),
}

export class ComfyWorkflow {
  static async get(type: keyof typeof COMFY_WORKFLOWS, payload: any) {
    return COMFY_WORKFLOWS[type].prompt(payload)
  }
}
