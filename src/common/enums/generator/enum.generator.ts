// generate-enums.ts

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

async function generateEnums() {
  const prismaService = new PrismaClient();

  const modules = await prismaService.modules.findMany();
  // Fetch permissions from the database
  const permissions = await prismaService.permissions.findMany();

  // Generate the permission enum

  const permissionEnum = permissions
    .map((permission) => {
      const moduleName = modules.find((module) => module.id === permission.module_id)?.name || 'UnknownModule';
      const formattedPermissionName = formatName(permission.name);
      return `${formattedPermissionName}_${formatName(moduleName)} = ${permission.id},`;
    })
    .join('\n');

  const permissionMap = permissions
    .map((permission) => {
      const moduleName = modules.find((module) => module.id === permission.module_id)?.name || 'UnknownModule';
      const formattedPermissionName = formatName(permission.name);
      return `${permission.id} : '${formattedPermissionName}_${formatName(moduleName)}',`;
    })
    .join('\n');

  // Fetch roles from the database
  const roles = await prismaService.roles.findMany();
  // Generate the role enum
  const roleEnum = roles
    .map((role) => {
      return `${formatName(role.name)} = ${role.id},`;
    })
    .join('\n');

  const roleMap = roles
    .map((role) => {
      return `${role.id} : '${role.name}',`;
    })
    .join('\n');
  // Generate TypeScript enum file
  const enumFileContent = `
    export enum Permission {
      ${permissionEnum}
    }

    export enum Role {
      ${roleEnum}
    }
  
    export const permissionNames: Record<any, any> = {
      ${permissionMap}
    }

    export const roleNames: Record<any, any> = {
      ${roleMap}
    }
    `;

  // Get the current directory path
  const currentDirectory = __dirname;

  // Define the relative path for the output file
  const outputFileRelativePath = '../roles_permissions.enum.ts';

  // Resolve the absolute path using the current directory and the relative path
  const absoluteOutputFilePath = path.resolve(currentDirectory, outputFileRelativePath);
  // Write the file to the resolved absolute path
  fs.writeFileSync(absoluteOutputFilePath, enumFileContent, { encoding: 'utf-8' });
}

generateEnums().catch(console.error);

// Function to format names by replacing spaces with underscores and converting to uppercase
const formatName = (name: string) => name.replace(/\s+/g, '_').toUpperCase();
