import { apiClient } from './client';
import type {
  CreateUserRequest,
  ManagedUser,
  MessageResponse,
  PageResponse,
  UpdateUserRequest,
  UserSearchParams,
} from './types';

export const usersApi = {
  search: (params: UserSearchParams = {}) =>
    apiClient
      .get<PageResponse<ManagedUser>>('/api/users', {
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
          search: params.search || undefined,
          role: params.role || undefined,
        },
      })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<ManagedUser>(`/api/users/${id}`).then((r) => r.data),

  create: (data: CreateUserRequest) =>
    apiClient.post<ManagedUser>('/api/users', data).then((r) => r.data),

  update: (id: number, data: UpdateUserRequest) =>
    apiClient.put<ManagedUser>(`/api/users/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete<MessageResponse>(`/api/users/${id}`).then((r) => r.data),
};
