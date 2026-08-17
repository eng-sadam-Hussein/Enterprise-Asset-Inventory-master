import { apiClient } from './client';
import type {
  MaintenanceRecord,
  MaintenanceRequestDto,
  MaintenanceSearchParams,
  MaintenanceStatus,
  MessageResponse,
  PageResponse,
} from './types';

export const maintenanceApi = {
  search: (params: MaintenanceSearchParams = {}) =>
    apiClient
      .get<PageResponse<MaintenanceRecord>>('/api/maintenance', {
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
          search: params.search || undefined,
          status: params.status || undefined,
        },
      })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<MaintenanceRecord>(`/api/maintenance/${id}`).then((r) => r.data),

  create: (data: MaintenanceRequestDto) =>
    apiClient.post<MaintenanceRecord>('/api/maintenance', data).then((r) => r.data),

  update: (id: number, data: MaintenanceRequestDto) =>
    apiClient.put<MaintenanceRecord>(`/api/maintenance/${id}`, data).then((r) => r.data),

  updateStatus: (id: number, status: MaintenanceStatus) =>
    apiClient
      .patch<MaintenanceRecord>(`/api/maintenance/${id}/status`, null, { params: { status } })
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete<MessageResponse>(`/api/maintenance/${id}`).then((r) => r.data),
};
