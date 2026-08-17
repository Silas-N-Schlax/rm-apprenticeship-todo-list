export class AppError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AppError'
  }

  static throw(message) {
    throw new AppError(message)
  }
}
