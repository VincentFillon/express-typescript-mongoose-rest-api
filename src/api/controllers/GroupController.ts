import { Authorized, Body, Delete, Get, JsonController, OnNull, Param, Post, Put, Req } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';
import { Group } from '../models/Group';
import { GroupService } from '../services/GroupService';
import { CreateGroupBody, UpdateGroupBody, UpdateGroupMembersBody } from './requests/GroupRequests';
import { GroupResponse } from './responses/GroupResponses';

// TODO: Gérer les accès en fonction des permissions de l'utilisateur connecté

@Service()
@Authorized()
@JsonController('/groups')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  @ResponseSchema(GroupResponse, { isArray: true })
  public find(): Promise<Group[]> {
    return this.groupService.find();
  }

  @Get('/me')
  @ResponseSchema(GroupResponse, { isArray: true })
  public findMe(@Req() req: any): Promise<Group[]> {
    return req.group;
  }

  @Get('/:id')
  @OnNull(() => new EntityNotFoundError(EntityNotFoundError.ENTITY_GROUP))
  @ResponseSchema(GroupResponse)
  public one(@Param('id') id: string): Promise<Group | null> {
    return this.groupService.findOne(id);
  }

  @Post()
  @ResponseSchema(GroupResponse)
  public create(@Body() body: CreateGroupBody): Promise<Group | null> {
    return this.groupService.create({
      name: body.name,
      email: body.email,
      avatar: body.avatar,
      members: body.members,
    });
  }

  @Put('/:id')
  @OnNull(() => new EntityNotFoundError(EntityNotFoundError.ENTITY_GROUP))
  @ResponseSchema(GroupResponse)
  public update(@Param('id') id: string, @Body() body: UpdateGroupBody): Promise<Group | null> {
    return this.groupService.update(id, {
      name: body.name,
      email: body.email,
      avatar: body.avatar,
      members: body.members,
    });
  }

  @Put('/:id/members')
  @OnNull(() => new EntityNotFoundError(EntityNotFoundError.ENTITY_GROUP))
  @ResponseSchema(GroupResponse)
  public updateEmail(@Param('id') id: string, @Body() body: UpdateGroupMembersBody): Promise<Group | null> {
    return this.groupService.update(id, {
      members: body.members,
    });
  }

  @Delete('/:id')
  @OnNull(() => new EntityNotFoundError(EntityNotFoundError.ENTITY_GROUP))
  @ResponseSchema(GroupResponse)
  public delete(@Param('id') id: string): Promise<Group | null> {
    return this.groupService.delete(id);
  }
}
