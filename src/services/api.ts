import axios from 'axios';
import Cookies from 'js-cookie';
import { LoginResponse, AttendanceData, CashflowData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    await api.post('/auth/logout');
    Cookies.remove('token');
    localStorage.removeItem('user');
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

// Staff API
export const staffAPI = {
  submitAttendance: async (data: AttendanceData) => {
    const response = await api.post('/attendance', data);
    return response.data;
  }
};

// Sales API
export const salesAPI = {
  getReports: async (filters?: { startDate?: string; endDate?: string; storeId?: string }) => {
    const response = await api.get('/sales', { params: filters });
    return response.data;
  },
  
  exportPDF: async (filters?: any) => {
    const response = await api.get('/export/pdf', { 
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },
  
  exportExcel: async (filters?: any) => {
    const response = await api.get('/export/excel', { 
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
};

// Attendance API
export const attendanceAPI = {
  getRecords: async (filters?: { startDate?: string; endDate?: string; storeId?: string }) => {
    const response = await api.get('/attendance', { params: filters });
    return response.data;
  },
  
  approveOvertime: async (id: string) => {
    const response = await api.patch(`/overtime/${id}/approve`);
    return response.data;
  }
};

// Cashflow API
export const cashflowAPI = {
  create: async (data: CashflowData) => {
    const response = await api.post('/cashflow', data);
    return response.data;
  },
  
  getRecords: async (filters?: any) => {
    const response = await api.get('/cashflow', { params: filters });
    return response.data;
  }
};

// Payroll API
export const payrollAPI = {
  generate: async (period: string) => {
    const response = await api.post('/payroll/generate', { period });
    return response.data;
  },
  
  markAsPaid: async (id: string) => {
    const response = await api.patch(`/payroll/${id}/pay`);
    return response.data;
  },
  
  getRecords: async (filters?: any) => {
    const response = await api.get('/payroll', { params: filters });
    return response.data;
  }
};

// Proposal API
export const proposalAPI = {
  create: async (data: { title: string; description: string; amount: number }) => {
    const response = await api.post('/proposal', data);
    return response.data;
  },
  
  approve: async (id: string) => {
    const response = await api.patch(`/proposal/${id}/approve`);
    return response.data;
  },
  
  reject: async (id: string) => {
    const response = await api.patch(`/proposal/${id}/reject`);
    return response.data;
  },
  
  getAll: async (filters?: any) => {
    const response = await api.get('/proposal', { params: filters });
    return response.data;
  }
};

// Overtime API
export const overtimeAPI = {
  getRecords: async (filters?: any) => {
    const response = await api.get('/overtime', { params: filters });
    return response.data;
  },
  
  approve: async (id: string) => {
    const response = await api.patch(`/overtime/${id}`, { status: 'approved' });
    return response.data;
  },
  
  reject: async (id: string) => {
    const response = await api.patch(`/overtime/${id}`, { status: 'rejected' });
    return response.data;
  }
};

// Google Sheets API
export const sheetsAPI = {
  sync: async (storeId: string) => {
    const response = await api.post(`/store/${storeId}/sync`);
    return response.data;
  }
};

export default api;