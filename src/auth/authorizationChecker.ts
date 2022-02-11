import { Request } from 'express';
import { Action } from 'routing-controllers';
import { Container } from 'typedi';
import { Permissions } from '../api/models/enums/Permissions';
import { env } from '../env';
import { Logger } from '../lib/logger';
import { AuthService } from './AuthService';

export function authorizationChecker(): (action: Action, roles: any[]) => Promise<boolean> | boolean {
  const log = new Logger(__filename);
  const authService = Container.get<AuthService>(AuthService);

  return async function innerAuthorizationChecker(action: Action, roles: string[]): Promise<boolean> {
    // here you can use request/response objects from action
    // also if decorator defines roles it needs to access the action
    // you can use them to provide granular access check
    // checker must return either boolean (true or false)
    // either promise that resolves a boolean value
    const credentials = authService.parseBasicAuthFromRequest(action.request);

    if (credentials === undefined) {
      log.warn('No credentials given');
      return false;
    }

    if (credentials.username === env.superadmin.login && credentials.password === env.superadmin.password) {
      log.info('Superadmin access');
      return true;
    }

    const user = await authService.validateUser(credentials.username, credentials.password);
    if (user === undefined) {
      log.warn('Invalid credentials given');
      return false;
    }

    action.request.user = user;

    // Test de gestion des droits par rapport au profil de l'utilisateur connecté
    const req = action.request as Request;
    const pathParts = req.path.match(/^\/api\/([^\/\?&=]+).*$/i);
    if (pathParts !== null && pathParts.length) {
      const path = pathParts[1];

      switch (path) {
        case 'pools':
          const poolId = req.params.id;
          if (poolId != null && req.method === 'PUT') {
            // Vérifier si l'utilisateur connecté à le droit de modifier l'entreprise (id)
            if (!user.profile.admin && !user.profile.permissions.get(Permissions.POOL_UPDATE)) {
              log.warn('Lack of permissions');
              return false;
            }
          } else if (poolId != null && req.method === 'DELETE') {
            // Vérifier si l'utilisateur connecté à le droit de supprimer l'entreprise (id)
            if (!user.profile.admin) {
              log.warn('Lack of permissions');
              return false;
            }
          } else if (req.method === 'POST') {
            // Vérifier si l'utilisateur connecté à le droit créer une autre entreprise
            log.warn('Lack of permissions');
            return false; // Droit réservé uniquement au superadmin
          } else if (poolId != null) {
            if (!user.profile.admin) {
              log.warn('Lack of permissions');
              return false;
            }
          }
          break;
        case 'groups':
          const groupId = req.params.id;
          if (groupId != null && req.method === 'PUT') {
            // Vérifier si l'utilisateur connecté à le droit de modifier le groupe (id)
            if (!user.profile.admin && !user.profile.director && !user.profile.permissions.get(Permissions.POOL_GROUPS_UPDATE)) {
              log.warn('Lack of permissions');
              return false;
            }
          } else if (groupId != null && req.method === 'DELETE') {
            // Vérifier si l'utilisateur connecté à le droit de supprimer le groupe (id)
            if (!user.profile.admin && !user.profile.permissions.get(Permissions.POOL_GROUPS_DELETE)) {
              log.warn('Lack of permissions');
              return false;
            }
          } else if (req.method === 'POST') {
            // Vérifier si l'utilisateur connecté à le droit créer un autre groupe
            if (!user.profile.admin) {
              log.warn('Lack of permissions');
              return false;
            }
          } else if (groupId != null) {
            if (!user.profile.admin && !user.profile.director && !user.profile.permissions.get(Permissions.POOL_GROUPS_GET)) {
              log.warn('Lack of permissions');
              return false;
            }
          }
          break;
        case 'users':
          const userId = req.params.id;
          if (userId != null && req.method === 'PUT') {
            // Vérifier si l'utilisateur connecté à le droit de modifier l'utilisateur (id)
            if (
              user._id !== userId &&
              !user.profile.admin &&
              !user.profile.director &&
              !user.profile.manager &&
              !user.profile.permissions.get(Permissions.GROUP_USERS_UPDATE)
            ) {
              log.warn('Lack of permissions');
              return false;
            }
          } else if (userId != null && req.method === 'DELETE') {
            // Vérifier si l'utilisateur connecté à le droit de supprimer l'utilisateur (id)
            if (
              user._id !== userId &&
              !user.profile.admin &&
              !user.profile.director &&
              !user.profile.manager &&
              !user.profile.permissions.get(Permissions.GROUP_USERS_DELETE)
            ) {
              log.warn('Lack of permissions');
              return false;
            }
          } else if (req.method === 'POST') {
            // Vérifier si l'utilisateur connecté à le droit créer un autre utilisateur
            if (!user.profile.admin && !user.profile.director && !user.profile.manager) {
              log.warn('Lack of permissions');
              return false;
            }
          } else if (userId != null) {
            if (
              user._id !== userId &&
              !user.profile.admin &&
              !user.profile.director &&
              !user.profile.manager &&
              !user.profile.permissions.get(Permissions.GROUP_USERS_GET)
            ) {
              log.warn('Lack of permissions');
              return false;
            }
          }
          break;
        default:
          log.warn('Unhandled api route permission');
          return false;
      }
    }

    log.info('Successfully checked credentials');
    return true;
  };
}
