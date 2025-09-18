export interface User {
  id: string;
  email: string;
  name: string;
  role: 'staff' | 'manager' | 'administrasi';
  store_id: string;
  store_name?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AttendanceData {
  namaKaryawan: string;
  jamMasuk: string;
  jamKeluar: string;
  meterData: {
    nomorAwal: number;
    nomorAkhir: number;
    totalLiter: number;
  };
  setoranData: {
    total: number;
    qris: number;
    cash: number;
  };
  pengeluaranItems: ItemData[];
  pemasukanItems: ItemData[];
}

export interface ItemData {
  id: string;
  description: string;
  amount: number;
}

export interface SalesReport {
  id: string;
  date: string;
  store_id: string;
  store_name: string;
  total_sales: number;
  total_liter: number;
  cash: number;
  qris: number;
}

export interface AttendanceRecord {
  id: string;
  staff_name: string;
  date: string;
  jam_masuk: string;
  jam_keluar: string;
  store_name: string;
  status: 'pending' | 'approved';
}

export interface CashflowData {
  kategori: string;
  tipe: 'masuk' | 'keluar';
  nominal: number;
  keterangan: string;
}

export interface PayrollRecord {
  id: string;
  staff_name: string;
  period: string;
  basic_salary: number;
  overtime_pay: number;
  total: number;
  status: 'pending' | 'paid';
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_by: string;
  created_at: string;
}

export interface OvertimeRecord {
  id: string;
  staff_name: string;
  date: string;
  hours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}