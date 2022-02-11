import { HttpError } from 'routing-controllers';

import { ErrorHandlerMiddleware } from '../../../src/api/middlewares/ErrorHandlerMiddleware';
import { LogMock } from '../lib/LogMock';

const MockExpressRequest = require('mock-express-request');
const MockExpressResponse = require('mock-express-response');

describe('ErrorHandlerMiddleware', () => {
  let log: LogMock;
  let middleware: ErrorHandlerMiddleware;
  let err: HttpError;
  let req: any;
  let res: any;
  beforeEach(() => {
    log = new LogMock();
    middleware = new ErrorHandlerMiddleware(log);
    req = new MockExpressRequest();
    res = new MockExpressResponse();
    err = new HttpError(400, 'Test Error');
  });

  test('Should not print stack out in production', () => {
    middleware.isProduction = true;
    middleware.error(err, req, res, () => {});
    const json = res._getJSON();
    expect(json.name).toBe(err.name);
    expect(json.message).toBe(err.message);
    expect(log.errorMock).toHaveBeenCalledWith(err.name, [err.message]);
  });

  test('Should print stack out in development', () => {
    middleware.isProduction = false;
    middleware.error(err, req, res, () => {});
    const json = res._getJSON();
    expect(json.name).toBe(err.name);
    expect(json.message).toBe(err.message);
    expect(log.errorMock).toHaveBeenCalled();
  });
});
