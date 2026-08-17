import { apiClient } from './client';
import type {
  Asset,
  AssetRequest,
  AssetSearchParams,
  MessageResponse,
  PageResponse,
} from './types';

export const assetsApi = {
  search: (params: AssetSearchParams = {}) =>
    apiClient
      .get<PageResponse<Asset>>('/api/assets', {
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
          search: params.search || undefined,
          status: params.status || undefined,
          category: params.category || undefined,
        },
      })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Asset>(`/api/assets/${id}`).then((r) => r.data),

  getByCode: (code: string) =>
    apiClient.get<Asset>(`/api/assets/code/${encodeURIComponent(code)}`).then((r) => r.data),

  getPublicByCode: (code: string) =>
    apiClient
      .get<Asset>(`/api/public/assets/by-code/${encodeURIComponent(code)}`)
      .then((r) => r.data),

  create: (data: AssetRequest) =>
    apiClient.post<Asset>('/api/assets', data).then((r) => r.data),

  update: (id: number, data: AssetRequest) =>
    apiClient.put<Asset>(`/api/assets/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete<MessageResponse>(`/api/assets/${id}`).then((r) => r.data),

  uploadImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<Asset>(`/api/assets/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  getQrUrl: (id: number) => `/api/assets/${id}/qr`,

  getBarcodeUrl: (id: number) => `/api/assets/${id}/barcode`,
};
