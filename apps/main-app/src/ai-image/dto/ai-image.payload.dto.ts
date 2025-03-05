import { ApiProperty } from '@nestjs/swagger'
import { FileSystemStoredFile, IsFile } from 'nestjs-form-data'

export class CreateAiImagePayload {
  @ApiProperty({ type: 'string', format: 'binary', description: 'file' })
  @IsFile()
  file!: FileSystemStoredFile
}
