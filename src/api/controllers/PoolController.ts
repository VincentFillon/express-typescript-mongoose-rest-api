import { Authorized, Body, Delete, Get, JsonController, OnNull, Param, Post, Put, Req } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';
import { Pool } from '../models/Pool';
import { PoolService } from '../services/PoolService';
import { CreatePoolBody, UpdatePoolBody, UpdatePoolBranchesBody } from './requests/PoolRequests';
import { PoolResponse } from './responses/PoolResponses';

// TODO: Gérer les accès en fonction des permissions de l'utilisateur connecté

@Service()
@Authorized()
@JsonController('/pools')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class PoolController {
  constructor(private poolService: PoolService) {}

  @Get()
  @ResponseSchema(PoolResponse, { isArray: true })
  public find(): Promise<Pool[]> {
    return this.poolService.find();
  }

  @Get('/me')
  @ResponseSchema(PoolResponse, { isArray: true })
  public findMe(@Req() req: any): Promise<Pool[]> {
    return req.pool;
  }

  @Get('/:id')
  @OnNull(() => new EntityNotFoundError(EntityNotFoundError.ENTITY_POOL))
  @ResponseSchema(PoolResponse)
  public one(@Param('id') id: string): Promise<Pool | null> {
    return this.poolService.findOne(id);
  }

  @Post()
  @ResponseSchema(PoolResponse)
  public create(@Body() body: CreatePoolBody): Promise<Pool | null> {
    return this.poolService.create({
      name: body.name,
      email: body.email,
      avatar: body.avatar,
      branches: body.branches,
    });
  }

  @Put('/:id')
  @OnNull(() => new EntityNotFoundError(EntityNotFoundError.ENTITY_POOL))
  @ResponseSchema(PoolResponse)
  public update(@Param('id') id: string, @Body() body: UpdatePoolBody): Promise<Pool | null> {
    return this.poolService.update(id, {
      name: body.name,
      email: body.email,
      avatar: body.avatar,
      branches: body.branches,
    });
  }

  @Put('/:id/branches')
  @OnNull(() => new EntityNotFoundError(EntityNotFoundError.ENTITY_POOL))
  @ResponseSchema(PoolResponse)
  public updateEmail(@Param('id') id: string, @Body() body: UpdatePoolBranchesBody): Promise<Pool | null> {
    return this.poolService.update(id, {
      branches: body.branches,
    });
  }

  @Delete('/:id')
  @OnNull(() => new EntityNotFoundError(EntityNotFoundError.ENTITY_POOL))
  @ResponseSchema(PoolResponse)
  public delete(@Param('id') id: string): Promise<Pool | null> {
    return this.poolService.delete(id);
  }
}
