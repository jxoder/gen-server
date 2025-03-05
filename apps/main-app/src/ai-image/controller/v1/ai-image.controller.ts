import { Body, Controller, Post } from '@nestjs/common'
import { ApiFormDataRequest, OkResponseDto } from '@slibs/api'

@Controller({ path: 'ai-images', version: '1' })
export class AiImageController {
  @Post()
  @ApiFormDataRequest()
  async create(@Body() body: { prompt: any }) {
    console.log(body)
    return OkResponseDto.from()
  }
}
