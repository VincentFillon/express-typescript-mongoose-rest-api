import { Authorized, Body, Delete, Get, JsonController, OnNull, Param, Post, Put, Req } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { CreateUserBody, UpdateUserBody, UpdateUserEmailBody, UpdateUserPasswordBody } from './requests/UserRequests';
import { UserResponse } from './responses/UserResponses';

@Service()
@Authorized()
@JsonController('/users')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ResponseSchema(UserResponse, { isArray: true })
  public find(): Promise<User[]> {
    return this.userService.find();
  }

  @Get('/me')
  @ResponseSchema(UserResponse, { isArray: true })
  public findMe(@Req() req: any): Promise<User[]> {
    return req.user;
  }

  @Get('/:id')
  @OnNull(() => new EntityNotFoundError(EntityNotFoundError.ENTITY_USER))
  @ResponseSchema(UserResponse)
  public one(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Post()
  @ResponseSchema(UserResponse)
  public create(@Body() body: CreateUserBody): Promise<User | null> {
    return this.userService.create({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      password: body.password,
      username: body.username ? body.username : body.email,
      profile: body.profile,
    });
  }

  @Put('/:id')
  @OnNull(() => new EntityNotFoundError(EntityNotFoundError.ENTITY_USER))
  @ResponseSchema(UserResponse)
  public update(@Param('id') id: string, @Body() body: UpdateUserBody): Promise<User | null> {
    return this.userService.update(id, {
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      profile: body.profile,
    });
  }

  @Put('/:id/email')
  @OnNull(() => new EntityNotFoundError(EntityNotFoundError.ENTITY_USER))
  @ResponseSchema(UserResponse)
  public updateEmail(@Param('id') id: string, @Body() body: UpdateUserEmailBody): Promise<User | null> {
    return this.userService.update(id, {
      email: body.email,
    });
  }

  @Put('/:id/password')
  @OnNull(() => new EntityNotFoundError(EntityNotFoundError.ENTITY_USER))
  @ResponseSchema(UserResponse)
  public updatePassword(@Param('id') id: string, @Body() body: UpdateUserPasswordBody): Promise<User | null> {
    return this.userService.update(id, {
      password: body.password,
    });
  }

  @Delete('/:id')
  @OnNull(() => new EntityNotFoundError(EntityNotFoundError.ENTITY_USER))
  @ResponseSchema(UserResponse)
  public delete(@Param('id') id: string): Promise<User | null> {
    return this.userService.delete(id);
  }
}
