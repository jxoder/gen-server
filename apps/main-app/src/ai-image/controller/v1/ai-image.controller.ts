import { Body, Controller, Post } from '@nestjs/common'
import { ApiFormDataRequest, OkResponseDto } from '@slibs/api'
import { CreateAiImagePayload } from '../../dto'

@Controller({ path: 'ai-images', version: '1' })
export class AiImageControllerV1 {
  @Post()
  @ApiFormDataRequest()
  async create(@Body() body: CreateAiImagePayload) {
    console.log(body)
    return OkResponseDto.from()
  }
}
