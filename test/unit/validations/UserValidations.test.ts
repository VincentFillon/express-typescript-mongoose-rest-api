import { validate } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../../../src/api/models/User';

describe('UserValidations', () => {
  test('User should always have a last name', async () => {
    const user = new User();
    const errorsOne = await validate(user);
    user.lastName = 'TestName';
    const errorsTwo = await validate(user);
    expect(errorsOne.length).toBeGreaterThan(errorsTwo.length);
  });

  test('User should always have a email', async () => {
    const user = new User();
    const errorsOne = await validate(user);
    user.email = 'test@test.com';
    const errorsTwo = await validate(user);
    expect(errorsOne.length).toBeGreaterThan(errorsTwo.length);
  });

  test('User should always have a username', async () => {
    const user = new User();
    const errorsOne = await validate(user);
    user.username = 'TestUsername';
    const errorsTwo = await validate(user);
    expect(errorsOne.length).toBeGreaterThan(errorsTwo.length);
  });

  test('User validation should succeed with all fields', async () => {
    const user = new User();
    user._id = uuidv4();
    user.lastName = 'TestName';
    user.email = 'test@test.com';
    user.username = 'test';
    user.password = '0n&Two3f0uR';
    const errors = await validate(user);
    expect(errors.length).toEqual(0);
  });
});
