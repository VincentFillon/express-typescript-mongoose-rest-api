import { HttpError } from 'routing-controllers';

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(403, message ? message : 'You are not authorized to perform this action.');
    this.name = 'UnauthorizedError';
  }
}
