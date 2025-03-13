import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { CryptoUtils, ERROR_MESSAGE, RandomUtils } from '@slibs/common'
import { IMailerClient, InjectMailer } from '@slibs/mailer'
import Redis from 'ioredis'
import { Transactional } from 'typeorm-transactional'
import { USER_ROLE } from '../constants'
import { EmailAccountRepository, UserRepository } from '../repository'

@Injectable()
export class EmailAccountService {
  constructor(
    @Inject(Redis) private readonly redis: Redis,
    @InjectMailer() private readonly mailer: IMailerClient,
    private readonly emailAccountRepository: EmailAccountRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async sendVerifyCode(email: string) {
    const exists = await this.emailAccountRepository.findOneBy({ email })
    if (exists) {
      throw new ConflictException(`${ERROR_MESSAGE.DUPLICATED}_EMAIL_ACCOUNT`) // duplicated error message
    }

    const limitKey = `signup:verify:limit:${email}`

    const pipeline = this.redis.pipeline()
    pipeline.incr(limitKey)
    pipeline.ttl(limitKey)

    const result = await pipeline.exec()
    if (!result) throw new InternalServerErrorException()

    const limit = result[0][1] as number

    if (limit === 1) {
      await this.redis.expire(limitKey, 3 * 60)
    }

    if (limit > 3) {
      throw new HttpException(
        ERROR_MESSAGE.TOO_MANY_REQUESTS,
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    const code = RandomUtils.randomNumberDigits(6).toString()

    await this.redis.set(`signup:verify:${email}`, code, 'EX', 3 * 60)

    // TODO: 템플릿 적용
    await this.mailer.send(email, 'Verify Code', `Your verify code is ${code}`)
  }

  @Transactional()
  async sign(input: {
    email: string
    password: string
    verifyCode: string
    name?: string
    role?: USER_ROLE
  }) {
    const code = await this.redis.get(`signup:verify:${input.email}`)
    if (code !== input.verifyCode) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_VERIFY_CODE)
    }

    const role = input.role ?? USER_ROLE.USER
    const userId = await this.userRepository.insert({ name: input.name, role })

    const hashedPassword = await CryptoUtils.genSaltedStr(input.password)
    await this.emailAccountRepository.insert({
      userId,
      email: input.email,
      password: hashedPassword,
    })
  }

  async login(input: { email: string; password: string }) {
    const emailAccount = await this.emailAccountRepository.findOneBy({
      email: input.email,
    })

    if (!emailAccount) {
      throw new UnauthorizedException(ERROR_MESSAGE.INVALID_CREDENTIAL)
    }

    const checkPassword = await CryptoUtils.compareSalted(
      input.password,
      emailAccount.password,
    )

    if (!checkPassword) {
      throw new UnauthorizedException(ERROR_MESSAGE.INVALID_CREDENTIAL)
    }

    await this.emailAccountRepository.update(emailAccount.id, {
      loggedAt: new Date(),
    })

    return this.userRepository.findOneByOrFail({ id: emailAccount.userId })
  }
}
