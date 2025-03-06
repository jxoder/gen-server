import { validate } from 'class-validator'
import { ComfyUIWorkflowType } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface Type<T = any> extends Function {
  new (...args: any[]): T
}

export abstract class ComfyWorkflowBase<PAYLOAD extends object> {
  constructor(
    public name: string,
    protected payload: Type<PAYLOAD>,
    protected defaultValue?: Partial<PAYLOAD>,
  ) {}

  async prompt(input: any): Promise<ComfyUIWorkflowType> {
    const payload = await this.validate(input)
    return this.template(payload)
  }

  private async validate(input: any): Promise<PAYLOAD> {
    const obj = Object.assign(new this.payload(), {
      ...(this.defaultValue ?? {}),
      ...input,
    })
    const errors = await validate(obj)

    if (errors.length > 0) {
      console.error(errors)
      throw new Error(errors.map(e => e.toString()).join('\n'))
    }

    return obj
  }

  protected abstract template(
    payload: PAYLOAD,
  ): Promise<ComfyUIWorkflowType> | ComfyUIWorkflowType
}
