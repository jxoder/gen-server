import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { OkResponseDto } from '@slibs/api'
import { EmailAccountService, UserAuthService } from '@slibs/user'
import {
  LoginEmailAccountPayload,
  LoginResponse,
  SignEmailAccountPayload,
} from '../dto'

@ApiTags('Auth/EmailAccount')
@Controller({ path: 'auth/email-account' })
export class EmailAccountController {
  constructor(
    private readonly emailAccountService: EmailAccountService,
    private readonly userAuthService: UserAuthService,
  ) {}

  @Post('sign')
  @ApiOperation({ summary: 'sign with email account' })
  @ApiResponse({ type: OkResponseDto })
  async sign(@Body() body: SignEmailAccountPayload) {
    await this.emailAccountService.sign(body)
    return OkResponseDto.from()
  }

  @Post('login')
  @ApiOperation({ summary: 'login with email account' })
  @ApiResponse({ type: LoginResponse })
  async login(@Body() body: LoginEmailAccountPayload) {
    const user = await this.emailAccountService.login(body)
    const refreshToken = await this.userAuthService.getRefreshToken(user.id)
    await this.userAuthService.renewRefreshToken(refreshToken)
    const accessToken = await this.userAuthService.createAccessToken(user.id)
    return LoginResponse.from(user, accessToken, refreshToken.token)
  }
}
