import { Service } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { PoolModel } from '../database/PoolModel';
import { EntityAlreadyExistsError } from '../errors/EntityAlreadyExistsError';
import { Pool, PoolInterface } from '../models/Pool';
import { events } from '../subscribers/events';
import { isNil } from '../utils/utils';

/**
 * PoolService
 * ------------------------------
 * PoolModel manager service
 *
 * @method **find** Retrieve all pools
 * @method **findOne** Retrieve one pool (by MongoDB '_id')
 * @method **findOneByPoolname** Retrieve one pool (by 'name')
 * @method **create** Create a new pool
 * @method **update** Update a pool (by MongoDB '_id')
 * @method **delete** Delete a pool (by MongoDB '_id')
 */
@Service()
export class PoolService {
  constructor(@EventDispatcher() private eventDispatcher: EventDispatcherInterface, @Logger(__filename) private log: LoggerInterface) {}

  /**
   * Retrieve all pools
   */
  public async find(): Promise<Pool[]> {
    this.log.info('Find all pools');

    const docs = await PoolModel.find();

    return docs.map(doc => (doc === null ? doc : new Pool(doc)));
  }

  /**
   * Retrieve one pool by his MongoDB '_id'
   * @param id MongoDB '_id'
   */
  public async findOne(id: string): Promise<Pool | null> {
    this.log.info('Find one pool');

    const doc = await PoolModel.findOne({ _id: id }).lean();

    return doc === null ? doc : new Pool(doc);
  }

  /**
   * Retrieve one pool by his 'poolname'
   * @param poolname
   */
  public async findOneByPoolname(poolname: string): Promise<Pool | null> {
    this.log.info('Find one pool');

    const doc = await PoolModel.findOne({ poolname }).lean();

    return doc === null ? doc : new Pool(doc);
  }

  /**
   * Create a new pool
   * @param pool
   */
  public async create(pool: PoolInterface): Promise<Pool> {
    this.log.info('Create a new pool => ', pool.toString());

    const newPoolDoc = new PoolModel(pool);

    let newPool: Pool;
    try {
      await newPoolDoc.save();
      newPool = new Pool(newPoolDoc.toObject());
    } catch (err) {
      if (!isNil(err) && (err as any).code && (err as any).code === 11000) {
        throw new EntityAlreadyExistsError(EntityAlreadyExistsError.ENTITY_POOL, (err as any).keyValue);
      } else {
        throw err;
      }
    }

    this.eventDispatcher.dispatch(events.pool.created, newPool);

    return newPool;
  }

  /**
   * Update a pool by his MongoDB '_id'
   * @param id MongoDB '_id'
   * @param pool
   */
  public async update(id: string, pool: PoolInterface): Promise<Pool | null> {
    this.log.info('Update a pool');

    const doc = await PoolModel.findByIdAndUpdate(id, { ...pool }, { new: true }).lean();

    const updatedPool = doc === null ? doc : new Pool(doc);

    if (updatedPool != null) {
      this.eventDispatcher.dispatch(events.pool.updated, updatedPool);
    }

    return updatedPool;
  }

  /**
   * Delete a pool by his MongoDB '_id'
   * @param id MongoDB '_id'
   */
  public async delete(id: string): Promise<Pool | null> {
    this.log.info('Delete a pool');

    const doc = await PoolModel.findByIdAndDelete(id).lean();

    const deletedPool = doc === null ? doc : new Pool(doc);

    if (deletedPool != null) {
      this.eventDispatcher.dispatch(events.pool.deleted, deletedPool);
    }

    return deletedPool;
  }
}
