import { HttpError } from 'routing-controllers';

export class HashingError extends HttpError {
  constructor() {
    super(500, 'Error while trying to hash password');
    this.name = 'HashingError';
  }
}
