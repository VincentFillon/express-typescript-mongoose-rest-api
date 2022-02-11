import { Service } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { UserModel } from '../../database/UserModel';
import { EntityAlreadyExistsError } from '../errors/EntityAlreadyExistsError';
import { User, UserInterface } from '../models/User';
import { events } from '../subscribers/events';
import { isNil } from '../utils/utils';

/**
 * UserService
 * ------------------------------
 * UserModel manager service
 *
 * @method **find** Retrieve all users
 * @method **findOne** Retrieve one user (by MongoDB '_id')
 * @method **findOneByUsername** Retrieve one user (by 'username')
 * @method **create** Create a new user
 * @method **update** Update a user (by MongoDB '_id')
 * @method **delete** Delete a user (by MongoDB '_id')
 */
@Service()
export class UserService {
  constructor(@EventDispatcher() private eventDispatcher: EventDispatcherInterface, @Logger(__filename) private log: LoggerInterface) {}

  /**
   * Retrieve all users
   */
  public async find(): Promise<User[]> {
    this.log.info('Find all users');

    const docs = await UserModel.find().lean();

    return docs.map(doc => (doc === null ? doc : new User(doc)));
  }

  /**
   * Retrieve one user by his MongoDB '_id'
   * @param id MongoDB '_id'
   */
  public async findOne(id: string): Promise<User | null> {
    this.log.info('Find one user');

    const doc = await UserModel.findOne({ _id: id }).lean();

    return doc === null ? doc : new User(doc);
  }

  /**
   * Retrieve one user by his 'username'
   * @param username
   */
  public async findOneByUsername(username: string): Promise<User | null> {
    this.log.info('Find one user');

    const doc = await UserModel.findOne({ username }).lean();

    return doc === null ? doc : new User(doc);
  }

  /**
   * Create a new user
   * @param user
   */
  public async create(user: UserInterface): Promise<User> {
    this.log.info('Create a new user => ', user.toString());

    const newUserDoc = new UserModel(user);

    let newUser: User;
    try {
      await newUserDoc.save();
      newUser = new User(newUserDoc.toObject());
    } catch (err) {
      if (!isNil(err) && (err as any).code && (err as any).code === 11000) {
        throw new EntityAlreadyExistsError(EntityAlreadyExistsError.ENTITY_USER, (err as any).keyValue);
      } else {
        throw err;
      }
    }

    this.eventDispatcher.dispatch(events.user.created, newUser);

    return newUser;
  }

  /**
   * Update a user by his MongoDB '_id'
   * @param id MongoDB '_id'
   * @param user
   */
  public async update(id: string, user: UserInterface): Promise<User | null> {
    this.log.info('Update a user');

    const doc = await UserModel.findByIdAndUpdate(id, { ...user }, { new: true }).lean();

    const updatedUser = doc === null ? doc : new User(doc);

    if (updatedUser != null) {
      this.eventDispatcher.dispatch(events.user.updated, updatedUser);
    }

    return updatedUser;
  }

  /**
   * Delete a user by his MongoDB '_id'
   * @param id MongoDB '_id'
   */
  public async delete(id: string): Promise<User | null> {
    this.log.info('Delete a user');

    const doc = await UserModel.findByIdAndDelete(id).lean();

    const deletedUser = doc === null ? doc : new User(doc);

    if (deletedUser != null) {
      this.eventDispatcher.dispatch(events.user.deleted, deletedUser);
    }

    return deletedUser;
  }
}
