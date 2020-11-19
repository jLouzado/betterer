import { BettererErrorDetails, ErrorLike } from './types';

export class BettererError extends Error {
  public details: BettererErrorDetails;

  public isBettererError = true;

  constructor(message: string, ...details: BettererErrorDetails) {
    super(message);

    Error.captureStackTrace(this, BettererError);
    Object.setPrototypeOf(this, new.target.prototype);

    this.details = details;
  }
}

export function isBettererError(err: unknown): err is BettererError {
  return !!(err as BettererError).isBettererError;
}

export function isErrorLike(err: unknown): err is ErrorLike {
  return (err as ErrorLike).message != null && (err as ErrorLike).stack !== null;
}
