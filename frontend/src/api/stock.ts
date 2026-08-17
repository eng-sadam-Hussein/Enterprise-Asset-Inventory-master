import { apiClient } from './client';
import type {
  MessageResponse,
  PageParams,
  PageResponse,
  StockItem,
  StockItemRequest,
  StockMovementRequest,
  StockTransaction,
} from './types';

export const stockApi = {
  search: (params: PageParams = {}) =>
    apiClient
      .get<PageResponse<StockItem>>('/api/stock', {
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
          search: params.search || undefined,
        },
      })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<StockItem>(`/api/stock/${id}`).then((r) => r.data),

  create: (data: StockItemRequest) =>
    apiClient.post<StockItem>('/api/stock', data).then((r) => r.data),

  update: (id: number, data: StockItemRequest) =>
    apiClient.put<StockItem>(`/api/stock/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete<MessageResponse>(`/api/stock/${id}`).then((r) => r.data),

  stockIn: (id: number, data: StockMovementRequest) =>
    apiClient.post<StockTransaction>(`/api/stock/${id}/stock-in`, data).then((r) => r.data),

  stockOut: (id: number, data: StockMovementRequest) =>
    apiClient.post<StockTransaction>(`/api/stock/${id}/stock-out`, data).then((r) => r.data),

  getLowStock: () =>
    apiClient.get<StockItem[]>('/api/stock/low-stock').then((r) => r.data),

  getTransactions: (id: number, params: PageParams = {}) =>
    apiClient
      .get<PageResponse<StockTransaction>>(`/api/stock/${id}/transactions`, {
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
        },
      })
      .then((r) => r.data),
};
