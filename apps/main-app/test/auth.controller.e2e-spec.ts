import { HttpStatus } from '@nestjs/common'
import { DayUtils, ERROR_MESSAGE, JWTUtils, RandomUtils } from '@slibs/common'
import { ApiClient, tk } from '@slibs/testing'
import { aa, ba, createClient } from './harness'

/**
 * EmailAccount Info
 */
const EMAIL = 'sample@example.com'
const PASSWORD = 'password'

/**
 * Paths
 */
const EMAIL_ACCOUNT_VERIFY = '/auth/email-account/verify'
const EMAIL_ACCOUNT_SIGN = '/auth/email-account/sign'
const EMAIL_ACCOUNT_LOGIN = '/auth/email-account/login'
const SELF_USER = '/v1/users/self'
const GET_ACCESS_TOKEN = '/auth/refresh-token'

describe('auth (e2e)', () => {
  beforeAll(ba)
  afterAll(aa)

  let client: ApiClient

  beforeEach(() => {
    client = createClient()
  })

  describe('email-account.controller', () => {
    describe('POST /auth/email-account/verify', () => {
      it('verify code & rate limit', async () => {
        const r = await client.post(EMAIL_ACCOUNT_VERIFY, {
          email: 'test2@example.com',
        })
        r.expectSuccess()

        const r2 = await client.post(EMAIL_ACCOUNT_VERIFY, {
          email: 'test2@example.com',
        })
        r2.expectSuccess()

        const r3 = await client.post(EMAIL_ACCOUNT_VERIFY, {
          email: 'test2@example.com',
        })
        r3.expectSuccess()

        const r4 = await client.post(EMAIL_ACCOUNT_VERIFY, {
          email: 'test2@example.com',
        })
        expect(r4.error.message).toBe(ERROR_MESSAGE.TOO_MANY_REQUESTS)

        tk.travel(DayUtils.getNow().add(4, 'minutes').toDate())

        const r5 = await client.post(EMAIL_ACCOUNT_VERIFY, {
          email: 'test2@example.com',
        })
        r5.expectSuccess()
      })
    })

    describe('POST /auth/email-account/sign', () => {
      it('verify code', async () => {
        jest
          .spyOn(RandomUtils, 'randomNumberDigits')
          .mockReturnValueOnce('123456')
        const r = await client.post(EMAIL_ACCOUNT_VERIFY, { email: EMAIL })
        r.expectSuccess()
      })

      it('invalid verify code', async () => {
        const e = await client.post(EMAIL_ACCOUNT_SIGN, {
          email: EMAIL,
          password: PASSWORD,
          verifyCode: '999999',
        })
        expect(e.error.code).toBe(HttpStatus.BAD_REQUEST)
        expect(e.error.message).toBe(ERROR_MESSAGE.INVALID_VERIFY_CODE)
      })

      it('success sign with email', async () => {
        const r = await client.post(EMAIL_ACCOUNT_SIGN, {
          email: EMAIL,
          password: PASSWORD,
          verifyCode: '123456',
        })
        r.expectSuccess()
      })

      it('duplicate email', async () => {
        const e = await client.post(EMAIL_ACCOUNT_VERIFY, { email: EMAIL })
        expect(e.error.code).toBe(HttpStatus.CONFLICT)
        expect(e.error.message).toBe(`DUPLICATED_EMAIL_ACCOUNT`)
      })

      it('invalid email format', async () => {
        const e = await client.post(EMAIL_ACCOUNT_SIGN, {
          email: 'invalid-email-format',
          password: PASSWORD,
          verifyCode: '123456',
        })
        expect(e.error.code).toBe(HttpStatus.BAD_REQUEST)
      })
    })

    describe('POST /auth/email-account/login', () => {
      it('success login with email', async () => {
        const r = await client.post(EMAIL_ACCOUNT_LOGIN, {
          email: EMAIL,
          password: PASSWORD,
        })
        r.expectSuccess()
        expect(r.data).toHaveProperty('accessToken')
        expect(r.data).toHaveProperty('refreshToken')
        expect(r.data).toHaveProperty('user')
      })

      it('invalid password', async () => {
        const e = await client.post(EMAIL_ACCOUNT_LOGIN, {
          email: EMAIL,
          password: 'invalid-password',
        })
        expect(e.error.code).toBe(HttpStatus.UNAUTHORIZED)
        expect(e.error.message).toBe(ERROR_MESSAGE.INVALID_CREDENTIAL)
      })

      it('not exist account', async () => {
        const e = await client.post(EMAIL_ACCOUNT_LOGIN, {
          email: 'no-exist@example.com',
          password: PASSWORD,
        })
        expect(e.error.code).toBe(HttpStatus.UNAUTHORIZED)
        expect(e.error.message).toBe(ERROR_MESSAGE.INVALID_CREDENTIAL)
      })
    })

    describe('jwt bearer authorized', () => {
      it('success get self user with access token', async () => {
        const r = await client.post(EMAIL_ACCOUNT_LOGIN, {
          email: EMAIL,
          password: PASSWORD,
        })
        r.expectSuccess()

        client.setToken(r.data.accessToken)

        const r1 = await client.get(SELF_USER)
        r1.expectSuccess()
        expect(r1.data).toHaveProperty('user')
      })

      it('unauthorized if no token', async () => {
        const r = await client.get(SELF_USER)
        expect(r.error.code).toBe(HttpStatus.UNAUTHORIZED)
      })

      it('unauthorized if invalid token', async () => {
        client.setToken('invalid-token')
        const r = await client.get(SELF_USER)
        expect(r.error.code).toBe(HttpStatus.UNAUTHORIZED)

        const invalidSecretToken = await JWTUtils.sign(
          { sub: 1 },
          { secret: 'invalid-secret' },
        )
        client.setToken(invalidSecretToken)
        const r2 = await client.get(SELF_USER)
        expect(r2.error.code).toBe(HttpStatus.UNAUTHORIZED)
      })

      it('unauthorized if expired token', async () => {
        const r = await client.post(EMAIL_ACCOUNT_LOGIN, {
          email: EMAIL,
          password: PASSWORD,
        })
        r.expectSuccess()

        client.setToken(r.data.accessToken)

        const r2 = await client.get(SELF_USER)
        r2.expectSuccess()

        // access token 1days
        tk.travel(DayUtils.getNow().add(25, 'hours').toDate())
        const r3 = await client.get(SELF_USER)
        expect(r3.error.code).toBe(HttpStatus.UNAUTHORIZED)
      })
    })

    describe('refresh token authorized', () => {
      it('success create access token with refresh token', async () => {
        const r = await client.post(EMAIL_ACCOUNT_LOGIN, {
          email: EMAIL,
          password: PASSWORD,
        })
        r.expectSuccess()
        client.setToken(r.data.refreshToken)

        const r2 = await client.post(GET_ACCESS_TOKEN)

        r2.expectSuccess()
        expect(r2.data).toHaveProperty('accessToken')
      })

      it('unauthorized if no token', async () => {
        const r = await client.post(GET_ACCESS_TOKEN)
        expect(r.error.code).toBe(HttpStatus.UNAUTHORIZED)
      })

      it('unauthorized if invalid token', async () => {
        client.setToken('invalid-token')
        const r = await client.post(GET_ACCESS_TOKEN)
        expect(r.error.code).toBe(HttpStatus.UNAUTHORIZED)
      })

      it('unauthorized if expired token', async () => {
        const r = await client.post(EMAIL_ACCOUNT_LOGIN, {
          email: EMAIL,
          password: PASSWORD,
        })
        r.expectSuccess()
        client.setToken(r.data.refreshToken)

        const r1 = await client.post(GET_ACCESS_TOKEN)
        r1.expectSuccess()

        tk.travel(DayUtils.getNow().add(31, 'days').toDate())
        const r2 = await client.post(GET_ACCESS_TOKEN)
        expect(r2.error.code).toBe(HttpStatus.UNAUTHORIZED)
      })
    })
  })
})
