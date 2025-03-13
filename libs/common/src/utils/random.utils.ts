import { v4 } from 'uuid'

export class RandomUtils {
  static uuidV4() {
    return v4()
  }

  static randomNumberBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static randomNumberDigits(length: number) {
    return Math.floor(
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1)) +
        Math.pow(10, length - 1),
    ).toString()
  }

  static randomString(
    len: number,
    src = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  ) {
    return Array.from(
      { length: len },
      () => src[Math.floor(Math.random() * src.length)],
    ).join('')
  }
}
