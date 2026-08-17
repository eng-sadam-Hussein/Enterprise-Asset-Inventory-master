export type Role = 'ADMIN' | 'ASSET_MANAGER' | 'INVENTORY_OFFICER' | 'TECHNICIAN' | 'AUDITOR';
export type Permission =
  | 'dashboard.read'
  | 'assets.read' | 'assets.write'
  | 'stock.read' | 'stock.write'
  | 'assignments.read' | 'assignments.write'
  | 'maintenance.read' | 'maintenance.write'
  | 'reports.read'
  | 'users.manage';

export type AssetStatus = 'AVAILABLE' | 'ASSIGNED' | 'UNDER_MAINTENANCE' | 'RETIRED';
export type AssetCategory = 'COMPUTERS' | 'LAPTOPS' | 'MONITORS' | 'PRINTERS' | 'SERVERS' | 'NETWORKING_DEVICES' | 'OFFICE_FURNITURE';
export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type AssignmentStatus = 'ACTIVE' | 'RETURNED';
export type StockTxnType = 'IN' | 'OUT';

export interface AuthResponse { token: string; type: string; id: number; username: string; email: string; fullName: string; role: Role; profileImage?: string; }
export interface LoginRequest { username: string; password: string; }
export interface RegisterRequest { username: string; email: string; password: string; fullName: string; department?: string; role?: Role; profileImage?: string; }
export interface MessageResponse { message: string; }
export interface PageResponse<T> { content: T[]; page: number; size: number; totalElements: number; totalPages: number; last: boolean; first: boolean; }

export interface Asset {
  id: number; assetCode: string; name: string; serialNumber?: string; category: AssetCategory;
  purchaseDate?: string; purchaseCost?: number; warrantyExpiry?: string; location?: string;
  status: AssetStatus; imageUrl?: string; qrCodeData?: string; barcodeData?: string; notes?: string;
  vendor?: string; department?: string; condition?: 'EXCELLENT'|'GOOD'|'FAIR'|'POOR';
  createdAt?: string; updatedAt?: string;
}
export interface AssetRequest { name: string; serialNumber?: string; category: AssetCategory; purchaseDate?: string; purchaseCost?: number; warrantyExpiry?: string; location?: string; status?: AssetStatus; notes?: string; vendor?: string; department?: string; condition?: Asset['condition']; }

export interface StockItem { id: number; itemName: string; sku: string; quantity: number; minimumStock: number; location?: string; description?: string; lowStock: boolean; unitCost?: number; category?: string; supplier?: string; createdAt?: string; updatedAt?: string; }
export interface StockItemRequest { itemName: string; sku: string; quantity: number; minimumStock: number; location?: string; description?: string; unitCost?: number; category?: string; supplier?: string; }
export interface StockMovementRequest { quantity: number; reason: string; }
export interface StockTransaction { id: number; stockItemId: number; itemName: string; sku: string; type: StockTxnType; quantity: number; reason: string; performedBy: string; createdAt: string; }

export interface Assignment { id: number; assetId: number; assetCode: string; assetName: string; employeeName: string; employeeId?: string; department?: string; assignmentDate: string; expectedReturnDate?: string; returnDate?: string; status: AssignmentStatus; notes?: string; assignedBy?: string; createdAt?: string; }
export interface AssignmentRequest { assetId: number; employeeName: string; employeeId?: string; department?: string; assignmentDate?: string; expectedReturnDate?: string; notes?: string; }
export interface ReturnAssignmentRequest { returnDate?: string; notes?: string; }

export interface MaintenanceRecord { id: number; assetId: number; assetCode: string; assetName: string; title: string; description?: string; scheduleDate?: string; technician?: string; vendor?: string; cost?: number; status: MaintenanceStatus; completedDate?: string; createdBy?: string; createdAt?: string; updatedAt?: string; }
export interface MaintenanceRequestDto { assetId: number; title: string; description?: string; scheduleDate?: string; technician?: string; vendor?: string; cost?: number; status?: MaintenanceStatus; }

export interface Activity { id: number; action: string; entityType: string; entityId: number; description: string; username: string; createdAt: string; }
export interface DashboardStats { totalAssets: number; availableAssets: number; assignedAssets: number; underMaintenance: number; totalInventoryItems: number; lowStockItems: number; recentActivities: Activity[]; }
export interface PageParams { page?: number; size?: number; search?: string; }
export interface AssetSearchParams extends PageParams { status?: AssetStatus; category?: AssetCategory; }
export interface AssignmentSearchParams extends PageParams { status?: AssignmentStatus; }
export interface MaintenanceSearchParams extends PageParams { status?: MaintenanceStatus; }

export interface User { id: number; username: string; email: string; fullName: string; role: Role; department?: string; profileImage?: string; }
export interface ManagedUser extends User { password?: string; jobTitle?: string; active?: boolean; createdAt?: string; }
export interface CreateUserRequest { username: string; email: string; password: string; fullName: string; department?: string; role: Role; jobTitle?: string; profileImage?: string; }
export interface UpdateUserRequest { email: string; fullName: string; department?: string; role: Role; password?: string; jobTitle?: string; active?: boolean; profileImage?: string; }
export interface UserSearchParams extends PageParams { role?: Role; }

export interface WorkspaceData {
  assets: Asset[];
  stock: StockItem[];
  stockTransactions: StockTransaction[];
  assignments: Assignment[];
  maintenance: MaintenanceRecord[];
  users: ManagedUser[];
  activities: Activity[];
  metadata: { version: number; seededAt: string; company: string; };
}
