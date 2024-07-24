export enum Permission {
  VIEW_DASHBOARD = 1,
  UPDATE_DASHBOARD = 2,
  VIEW_PROFILE = 3,
  UPDATE_PROFILE = 4,
  ADD_USER_MANAGEMENT = 5,
  UPDATE_USER_MANAGEMENT = 6,
  DELETE_USER_MANAGEMENT = 7,
  VIEW_USER_MANAGEMENT = 8,
}

export enum Role {
  SUPER_ADMIN = 1,
  MANAGER = 2,
  USER = 3,
}

export const permissionNames: Record<any, any> = {
  1: 'VIEW_DASHBOARD',
  2: 'UPDATE_DASHBOARD',
  3: 'VIEW_PROFILE',
  4: 'UPDATE_PROFILE',
  5: 'ADD_USER_MANAGEMENT',
  6: 'UPDATE_USER_MANAGEMENT',
  7: 'DELETE_USER_MANAGEMENT',
  8: 'VIEW_USER_MANAGEMENT',
};

export const roleNames: Record<any, any> = {
  1: 'Super Admin',
  2: 'Manager',
  3: 'User',
};
