import { Service } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { GroupModel } from '../database/GroupModel';
import { EntityAlreadyExistsError } from '../errors/EntityAlreadyExistsError';
import { Group, GroupInterface } from '../models/Group';
import { events } from '../subscribers/events';
import { isNil } from '../utils/utils';

/**
 * GroupService
 * ------------------------------
 * GroupModel manager service
 *
 * @method **find** Retrieve all groups
 * @method **findOne** Retrieve one group (by MongoDB '_id')
 * @method **findOneByGroupname** Retrieve one group (by 'name')
 * @method **create** Create a new group
 * @method **update** Update a group (by MongoDB '_id')
 * @method **delete** Delete a group (by MongoDB '_id')
 */
@Service()
export class GroupService {
  constructor(@EventDispatcher() private eventDispatcher: EventDispatcherInterface, @Logger(__filename) private log: LoggerInterface) {}

  /**
   * Retrieve all groups
   */
  public async find(): Promise<Group[]> {
    this.log.info('Find all groups');

    const docs = await GroupModel.find();

    return docs.map(doc => (doc === null ? doc : new Group(doc)));
  }

  /**
   * Retrieve one group by his MongoDB '_id'
   * @param id MongoDB '_id'
   */
  public async findOne(id: string): Promise<Group | null> {
    this.log.info('Find one group');

    const doc = await GroupModel.findOne({ _id: id }).lean();

    return doc === null ? doc : new Group(doc);
  }

  /**
   * Retrieve one group by his 'groupname'
   * @param groupname
   */
  public async findOneByGroupname(groupname: string): Promise<Group | null> {
    this.log.info('Find one group');

    const doc = await GroupModel.findOne({ groupname }).lean();

    return doc === null ? doc : new Group(doc);
  }

  /**
   * Create a new group
   * @param group
   */
  public async create(group: GroupInterface): Promise<Group> {
    this.log.info('Create a new group => ', group.toString());

    const newGroupDoc = new GroupModel(group);

    let newGroup: Group;
    try {
      await newGroupDoc.save();
      newGroup = new Group(newGroupDoc.toObject());
    } catch (err) {
      if (!isNil(err) && (err as any).code && (err as any).code === 11000) {
        throw new EntityAlreadyExistsError(EntityAlreadyExistsError.ENTITY_GROUP, (err as any).keyValue);
      } else {
        throw err;
      }
    }

    this.eventDispatcher.dispatch(events.group.created, newGroup);

    return newGroup;
  }

  /**
   * Update a group by his MongoDB '_id'
   * @param id MongoDB '_id'
   * @param group
   */
  public async update(id: string, group: GroupInterface): Promise<Group | null> {
    this.log.info('Update a group');

    const doc = await GroupModel.findByIdAndUpdate(id, { ...group }, { new: true }).lean();

    const updatedGroup = doc === null ? doc : new Group(doc);

    if (updatedGroup != null) {
      this.eventDispatcher.dispatch(events.group.updated, updatedGroup);
    }

    return updatedGroup;
  }

  /**
   * Delete a group by his MongoDB '_id'
   * @param id MongoDB '_id'
   */
  public async delete(id: string): Promise<Group | null> {
    this.log.info('Delete a group');

    const doc = await GroupModel.findByIdAndDelete(id).lean();

    const deletedGroup = doc === null ? doc : new Group(doc);

    if (deletedGroup != null) {
      this.eventDispatcher.dispatch(events.group.deleted, deletedGroup);
    }

    return deletedGroup;
  }
}
