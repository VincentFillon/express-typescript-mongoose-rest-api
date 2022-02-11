export enum Permissions {
  /** Allowed to update his own pool */
  POOL_UPDATE        = 'pool_update',

  /** Allowed to view any branches from his pool */
  POOL_GROUPS_GET    = 'pool_groups_get',
  /** Allowed to update any branch from his pool */
  POOL_GROUPS_UPDATE = 'pool_groups_update',
  /** Allowed to delete any branch from his pool */
  POOL_GROUPS_DELETE = 'pool_groups_delete',

  /** Allowed to view any users from his group */
  GROUP_USERS_GET    = 'group_users_get',
  /** Allowed to update any group from his group */
  GROUP_USERS_UPDATE = 'group_users_update',
  /** Allowed to delete any group from his group */
  GROUP_USERS_DELETE = 'group_users_delete',
}
