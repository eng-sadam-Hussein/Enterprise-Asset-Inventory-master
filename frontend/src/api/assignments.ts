import { apiClient } from './client';
import type {
  Assignment,
  AssignmentRequest,
  AssignmentSearchParams,
  ReturnAssignmentRequest,
  PageResponse,
} from './types';

export const assignmentsApi = {
  search: (params: AssignmentSearchParams = {}) =>
    apiClient
      .get<PageResponse<Assignment>>('/api/assignments', {
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
          search: params.search || undefined,
          status: params.status || undefined,
        },
      })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Assignment>(`/api/assignments/${id}`).then((r) => r.data),

  assign: (data: AssignmentRequest) =>
    apiClient.post<Assignment>('/api/assignments', data).then((r) => r.data),

  returnAssignment: (id: number, data: ReturnAssignmentRequest = {}) =>
    apiClient.put<Assignment>(`/api/assignments/${id}/return`, data).then((r) => r.data),

  getHistoryByAsset: (assetId: number) =>
    apiClient.get<Assignment[]>(`/api/assignments/asset/${assetId}/history`).then((r) => r.data),
};
