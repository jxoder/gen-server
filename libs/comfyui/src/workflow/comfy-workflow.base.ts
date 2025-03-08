import { plainToInstance } from 'class-transformer'
import { IsPositive, IsString, validate } from 'class-validator'
import { ComfyUIWorkflowType } from '../types'

export class ComfyWorkflowPayloadBase {
  @IsString()
  prompt!: string

  @IsPositive()
  width: number = 1024

  @IsPositive()
  height: number = 1024
}

type Type<T> = new (...args: any[]) => T

export abstract class ComfyWorkflowBase<
  PAYLOAD extends ComfyWorkflowPayloadBase,
> {
  constructor(
    public name: string,
    protected payloadDto: Type<PAYLOAD>,
  ) {}

  async prompt(input: any): Promise<ComfyUIWorkflowType> {
    const payload = await this.validate(input)
    return this.template(payload)
  }

  private async validate(input: any): Promise<PAYLOAD> {
    const instance = plainToInstance(this.payloadDto, input)
    const errors = await validate(instance)

    if (errors.length > 0) {
      console.error(errors)
      throw new Error(errors.map(e => e.toString()).join('\n'))
    }

    return Object.getOwnPropertyNames(new this.payloadDto()).reduce(
      (acc, key: string) => {
        // @ts-ignore safety type
        acc[key] = instance[key]
        return acc
      },
      {} as PAYLOAD,
    )
  }

  protected abstract template(
    payload: PAYLOAD,
  ): Promise<ComfyUIWorkflowType> | ComfyUIWorkflowType
}
