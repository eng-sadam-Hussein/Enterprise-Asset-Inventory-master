import { Navigate } from 'react-router-dom';
import type { Permission } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { can } from '../../utils/permissions';
export default function PermissionRoute({permission,children}:{permission:Permission;children:React.ReactNode}){const {user}=useAuth(); return can(user?.role,permission)?<>{children}</>:<Navigate to="/dashboard" replace/>;}
