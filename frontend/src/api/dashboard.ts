import { apiClient } from './client';
import type { DashboardStats } from './types';

export const dashboardApi = {
  getStats: () =>
    apiClient.get<DashboardStats>('/api/dashboard/stats').then((r) => r.data),
};
