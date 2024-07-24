import { PrismaClient } from '@prisma/client';
import { $Enums } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  /// CREATE MODULE SEED DATA

  await prisma.modules.createMany({
    data: [
      {
        id: 1,
        name: 'Dashboard',
        description: 'Access to view and manage dashboard',
      },
      {
        id: 2,
        name: 'Profile',
        description: 'User profile access and management',
      },
      {
        id: 3,
        name: 'User Management',
        description: 'Manage user accounts, roles, and permissions',
      },
    ],
  });

  /// CREATE PERMISSION SEED DATA

  await prisma.permissions.createMany({
    data: [
      {
        id: 1,
        name: 'view',
        description: 'View dashboard',
        module_id: 1,
      },
      {
        id: 2,
        name: 'update',
        description: 'Update dashboard',
        module_id: 1,
      },
      {
        id: 3,
        name: 'add',
        description: 'Add dashboard',
        module_id: 1,
      },
      {
        id: 4,
        name: 'upload',
        description: 'Upload dashboard',
        module_id: 1,
      },
      {
        id: 5,
        name: 'download',
        description: 'Download dashboard',
        module_id: 1,
      },
      {
        id: 6,
        name: 'view',
        description: 'View profile',
        module_id: 2,
      },
      {
        id: 7,
        name: 'update',
        description: 'Update profile',
        module_id: 2,
      },
      {
        id: 8,
        name: 'add',
        description: 'Add profile',
        module_id: 2,
      },
      {
        id: 9,
        name: 'upload',
        description: 'Upload profile',
        module_id: 2,
      },
      {
        id: 10,
        name: 'download',
        description: 'Download profile',
        module_id: 2,
      },
      {
        id: 17,
        name: 'delete',
        description: 'Delete Profile',
        module_id: 2,
      },
      {
        id: 11,
        name: 'add',
        description: 'Add new user',
        module_id: 3,
      },
      {
        id: 12,
        name: 'update',
        description: 'Update new user',
        module_id: 3,
      },
      {
        id: 13,
        name: 'delete',
        description: 'Delete new user',
        module_id: 3,
      },
      {
        id: 14,
        name: 'view',
        description: 'View new user',
        module_id: 3,
      },
      {
        id: 15,
        name: 'upload',
        description: 'Upload new user',
        module_id: 3,
      },
      {
        id: 16,
        name: 'download',
        description: 'Download new user',
        module_id: 3,
      },
    ],
  });

  /// CREATE ROLE SEED DATA

  await prisma.roles.createMany({
    data: [
      {
        id: 1,
        name: 'Super Admin',
        description: 'System administrator with all permissions',
      },
      {
        id: 2,
        name: 'Manager',
        description: 'User manager with limited permissions',
      },
      {
        id: 3,
        name: 'User',
        description: 'Regular user with basic permissions',
      },
    ],
  });

  /// Insert role_permissions data

  await prisma.role_permissions.createMany({
    data: [
      // Super Admin Role Permissions
      { role_id: 1, permission_id: 1 },
      { role_id: 1, permission_id: 2 },
      { role_id: 1, permission_id: 3 },
      { role_id: 1, permission_id: 4 },
      { role_id: 1, permission_id: 5 },
      { role_id: 1, permission_id: 6 },
      { role_id: 1, permission_id: 7 },
      { role_id: 1, permission_id: 8 },
      { role_id: 1, permission_id: 9 },
      { role_id: 1, permission_id: 10 },
      { role_id: 1, permission_id: 11 },
      { role_id: 1, permission_id: 12 },
      { role_id: 1, permission_id: 13 },
      { role_id: 1, permission_id: 14 },
      { role_id: 1, permission_id: 15 },
      { role_id: 1, permission_id: 16 },

      // Manager Role Permissions
      { role_id: 2, permission_id: 3 },
      { role_id: 2, permission_id: 4 },
      { role_id: 2, permission_id: 7 },
      { role_id: 2, permission_id: 8 },

      // User Role Permissions
      { role_id: 3, permission_id: 3 },
      { role_id: 3, permission_id: 4 },
    ],
  });

  // Insert admin user
  await prisma.users.createMany({
    data: [
      {
        id: '55b49326-84b7-4fb0-a90a-62cdebd3f562',
        email: 'admin@gmail.com',
        password: '$2b$10$QWR.DGyma0yAbJWjpaFIlus.fvACtL02h2iXI.mcSxoSBmdLQxHWa',
        email_verified: true,
        first_name: 'Admin',
        phone_number: '9971840369',
        last_name: 'User',
        gender: $Enums.gender.Male,
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
      },
      {
        id: '55b49326-84b7-4fb0-a90a-62cdebd3f563',
        email: 'manager@gmail.com',
        password: '$2b$10$QWR.DGyma0yAbJWjpaFIlus.fvACtL02h2iXI.mcSxoSBmdLQxHWa',
        email_verified: true,
        first_name: 'Manager',
        phone_number: '9971840368',
        last_name: 'User',
        gender: $Enums.gender.Male,
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
      },
      {
        id: '55b49326-84b7-4fb0-a90a-62cdebd3f564',
        email: 'user@gmail.com',
        password: '$2b$10$QWR.DGyma0yAbJWjpaFIlus.fvACtL02h2iXI.mcSxoSBmdLQxHWa',
        email_verified: true,
        first_name: 'User',
        phone_number: '9971840360',
        last_name: 'User',
        gender: $Enums.gender.Male,
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
      },
    ],
  });

  await prisma.user_roles.create({
    data: {
      user_id: '55b49326-84b7-4fb0-a90a-62cdebd3f562',
      role_id: 1,
    },
  });

  await prisma.user_permissions.create({
    data: {
      user_id: '55b49326-84b7-4fb0-a90a-62cdebd3f564',
      permission_id: 5,
      granted: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
