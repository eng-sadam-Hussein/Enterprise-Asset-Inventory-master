import type { Permission, Role } from '../api/types';

export const ROLE_LABELS: Record<Role,string> = {
  ADMIN:'Administrator', ASSET_MANAGER:'Asset Manager', INVENTORY_OFFICER:'Inventory Officer', TECHNICIAN:'Technician', AUDITOR:'Auditor'
};
export const ROLE_DESCRIPTIONS: Record<Role,string> = {
  ADMIN:'Full workspace administration and user management',
  ASSET_MANAGER:'Asset lifecycle, assignments and operational oversight',
  INVENTORY_OFFICER:'Stock control, replenishment and inventory operations',
  TECHNICIAN:'Maintenance execution and technical asset visibility',
  AUDITOR:'Read-only visibility across operational and financial records',
};
const all: Permission[]=['dashboard.read','assets.read','assets.write','stock.read','stock.write','assignments.read','assignments.write','maintenance.read','maintenance.write','reports.read','users.manage'];
export const ROLE_PERMISSIONS: Record<Role,Permission[]> = {
  ADMIN:all,
  ASSET_MANAGER:['dashboard.read','assets.read','assets.write','stock.read','assignments.read','assignments.write','maintenance.read','reports.read'],
  INVENTORY_OFFICER:['dashboard.read','assets.read','stock.read','stock.write','assignments.read','reports.read'],
  TECHNICIAN:['dashboard.read','assets.read','assignments.read','maintenance.read','maintenance.write','reports.read'],
  AUDITOR:['dashboard.read','assets.read','stock.read','assignments.read','maintenance.read','reports.read'],
};
export const can = (role:Role|undefined, permission:Permission) => Boolean(role && ROLE_PERMISSIONS[role]?.includes(permission));
