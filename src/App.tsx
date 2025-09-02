import React, { useState, useEffect } from 'react';
import { FileText, Copy, Plus } from 'lucide-react';

interface MeterData {
  nomorAwal: number;
  nomorAkhir: number;
  totalLiter: number;
}

interface SetoranData {
  total: number;
  qris: number;
  cash: number;
}

interface ItemData {
  id: string;
  description: string;
  amount: number;
}

function App() {
  const [namaKaryawan, setNamaKaryawan] = useState('');
  const [jamMasuk, setJamMasuk] = useState('');
  const [jamKeluar, setJamKeluar] = useState('');
  const [meterData, setMeterData] = useState<MeterData>({
    nomorAwal: 0,
    nomorAkhir: 0,
    totalLiter: 0
  });
  
  const [setoranData, setSetoranData] = useState<SetoranData>({
    total: 0,
    qris: 0,
    cash: 0
  });

  const [pengeluaranItems, setPengeluaranItems] = useState<ItemData[]>([]);
  const [pemasukanItems, setPemasukanItems] = useState<ItemData[]>([]);
  const [showPengeluaranForm, setShowPengeluaranForm] = useState(false);
  const [showPemasukanForm, setShowPemasukanForm] = useState(false);

  // Format jam kerja output
  const getJamKerjaOutput = () => {
    if (jamMasuk && jamKeluar) {
      return `(${jamMasuk} - ${jamKeluar})`;
    }
    return '';
  };

  // Calculate total liter when nomor awal/akhir changes
  useEffect(() => {
    const totalLiter = Math.max(0, meterData.nomorAkhir - meterData.nomorAwal);
    setMeterData(prev => ({ ...prev, totalLiter }));
  }, [meterData.nomorAwal, meterData.nomorAkhir]);

  // Calculate total and cash based on logic: Total = Total Liter * 11500, Cash = Total - QRIS
  useEffect(() => {
    const total = meterData.totalLiter * 11500;
    const cash = Math.max(0, total - setoranData.qris);
    setSetoranData(prev => ({ ...prev, total, cash }));
  }, [meterData.totalLiter, setoranData.qris]);

  const handleQrisChange = (value: number) => {
    setSetoranData(prev => ({ ...prev, qris: value }));
  };

  const totalPengeluaran = pengeluaranItems.reduce((sum, item) => sum + item.amount, 0);
  const totalPemasukan = pemasukanItems.reduce((sum, item) => sum + item.amount, 0);
  const totalKeseluruhan = setoranData.cash + totalPemasukan - totalPengeluaran;

  const addPengeluaranItem = (description: string, amount: number) => {
    const newItem: ItemData = {
      id: Date.now().toString(),
      description,
      amount
    };
    setPengeluaranItems(prev => [...prev, newItem]);
    setShowPengeluaranForm(false);
  };

  const addPemasukanItem = (description: string, amount: number) => {
    const newItem: ItemData = {
      id: Date.now().toString(),
      description,
      amount
    };
    setPemasukanItems(prev => [...prev, newItem]);
    setShowPemasukanForm(false);
  };

  const removeItem = (id: string, type: 'pengeluaran' | 'pemasukan') => {
    if (type === 'pengeluaran') {
      setPengeluaranItems(prev => prev.filter(item => item.id !== id));
    } else {
      setPemasukanItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const getCurrentDate = () => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const now = new Date();
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    return `${day}, ${date} ${month} ${year}`;
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (value: string) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    // Format with thousand separators
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseFormattedNumber = (value: string) => {
    return parseInt(value.replace(/\./g, '')) || 0;
  };

  const copyToClipboard = () => {
    const text = `
*Setoran Harian* 📋
👤 Nama: ${namaKaryawan}
${getCurrentDate()}
🕐 Jam: ${getJamKerjaOutput()}

⛽ Data Meter
• Nomor Awal : ${meterData.nomorAwal}
• Nomor Akhir: ${meterData.nomorAkhir}
• Total Liter: ${meterData.totalLiter.toFixed(2)} L

💰 Setoran
• Cash  : Rp ${formatRupiah(setoranData.cash)}
• QRIS  : Rp ${formatRupiah(setoranData.qris)}
• Total : Rp ${formatRupiah(setoranData.total)}

${pengeluaranItems.length > 0 ? `💸 Pengeluaran (PU)
${pengeluaranItems.map(item => `• ${item.description}: Rp ${formatRupiah(item.amount)}`).join('\n')}
Total Pengeluaran: Rp ${formatRupiah(totalPengeluaran)}

` : ''}${pemasukanItems.length > 0 ? `💵 Pemasukan (PU)
${pemasukanItems.map(item => `• ${item.description}: Rp ${formatRupiah(item.amount)}`).join('\n')}
Total Pemasukan: Rp ${formatRupiah(totalPemasukan)}

` : ''}💼 Total Keseluruhan: Rp ${formatRupiah(totalKeseluruhan)}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      alert('Laporan berhasil disalin ke clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-2xl mx-auto px-3">
        {/* Header */}
        <div className="text-center mb-6">
         
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 space-y-6">
          {/* Title with Date */}
          <div className="border-b pb-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              Setoran Harian 📋 </h2>
             {getCurrentDate()}
          </div>

          {/* Nama Karyawan */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">👤 Nama Karyawan</h3>
            <input
              type="text"
              value={namaKaryawan}
              onChange={(e) => setNamaKaryawan(e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nama karyawan..."
            />
          </div>

          {/* Jam Kerja */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">🕐 Jam Kerja</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Jam Masuk</label>
                <input
                  type="time"
                  value={jamMasuk}
                  onChange={(e) => setJamMasuk(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Jam Keluar</label>
                <input
                  type="time"
                  value={jamKeluar}
                  onChange={(e) => setJamKeluar(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {getJamKerjaOutput() && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700 font-medium">
                  Jam Kerja: {getJamKerjaOutput()}
                </span>
              </div>
            )}
          </div>

          {/* Data Meter */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              ⛽ Data Meter
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nomor Awal</label>
                <input
                  type="number"
                  value={meterData.nomorAwal || ''}
                  onChange={(e) => setMeterData(prev => ({ ...prev, nomorAwal: Number(e.target.value) || 0 }))}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nomor Akhir</label>
                <input
                  type="number"
                  value={meterData.nomorAkhir || ''}
                  onChange={(e) => setMeterData(prev => ({ ...prev, nomorAkhir: Number(e.target.value) || 0 }))}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Total Liter</label>
                <div className="relative">
                  <input
                    type="text"
                    value={`${meterData.totalLiter.toFixed(2)} L`}
                    readOnly
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                    {meterData.totalLiter.toFixed(2)} L
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Setoran */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              💰 Setoran
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cash</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                  <input
                    type="text"
                    value={formatRupiah(setoranData.cash)}
                    readOnly
                    className="w-full p-2.5 pl-8 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">QRIS</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                  <input
                    type="text"
                    value={setoranData.qris ? formatNumber(setoranData.qris.toString()) : ''}
                    onChange={(e) => handleQrisChange(parseFormattedNumber(e.target.value))}
                    className="w-full p-2.5 pl-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Total
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                  <input
                    type="text"
                    value={formatRupiah(setoranData.total)}
                    readOnly
                    className="w-full p-2.5 pl-8 text-sm border border-green-300 rounded-lg bg-green-50 text-green-700 font-semibold"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
                    {formatRupiah(setoranData.total)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pengeluaran */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                💸 Pengeluaran (PU)
              </h3>
              <button
                onClick={() => setShowPengeluaranForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={14} />
                Tambah Item
              </button>
            </div>
            
            {showPengeluaranForm && (
              <ItemForm
                onSubmit={addPengeluaranItem}
                onCancel={() => setShowPengeluaranForm(false)}
                type="pengeluaran"
              />
            )}

            {pengeluaranItems.map(item => (
              <div key={item.id} className="flex justify-between items-center p-2.5 bg-red-50 rounded-lg mb-2">
                <span className="text-sm text-gray-700">{item.description}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-600 font-semibold">Rp {formatRupiah(item.amount)}</span>
                  <button
                    onClick={() => removeItem(item.id, 'pengeluaran')}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-red-100 p-2.5 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Pengeluaran:</span>
                <span className="text-red-600 font-bold text-base">Rp {formatRupiah(totalPengeluaran)}</span>
              </div>
            </div>
          </div>

          {/* Pemasukan */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                💵 Pemasukan (PU)
              </h3>
              <button
                onClick={() => setShowPemasukanForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus size={14} />
                Tambah Item
              </button>
            </div>

            {showPemasukanForm && (
              <ItemForm
                onSubmit={addPemasukanItem}
                onCancel={() => setShowPemasukanForm(false)}
                type="pemasukan"
              />
            )}

            {pemasukanItems.map(item => (
              <div key={item.id} className="flex justify-between items-center p-2.5 bg-green-50 rounded-lg mb-2">
                <span className="text-sm text-gray-700">{item.description}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 font-semibold">Rp {formatRupiah(item.amount)}</span>
                  <button
                    onClick={() => removeItem(item.id, 'pemasukan')}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-green-100 p-2.5 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Pemasukan:</span>
                <span className="text-green-600 font-bold text-base">Rp {formatRupiah(totalPemasukan)}</span>
              </div>
            </div>
          </div>

          {/* Total Keseluruhan */}
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">💼 Total Keseluruhan:</h3>
              <div className="text-right">
                <div className="text-xl font-bold">Rp {formatRupiah(totalKeseluruhan)}</div>
                <div className="text-xs opacity-75">
                  Setoran: {formatRupiah(setoranData.cash)} + Pemasukan: {formatRupiah(totalPemasukan)} - Pengeluaran: {formatRupiah(totalPengeluaran)}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2" >
            <button 
              onClick={copyToClipboard}
              className="flex-1 bg-blue-600 text-white py-2.5 px-4 text-sm rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Copy size={16} />
              Copy ke Clipboard
            </button>
            <button disabled 
              onClick={copyToClipboard}
              className="flex-1 bg-white-600 text-white py-2.5 px-4 text-sm rounded-lg font-semibold hover:bg-white-700 transition-colors flex items-center justify-center gap-2"
            >
              <Copy size={16} />
              Copy ke Clipboard
            </button>
          </div>
        </div>
      </div>
    </div> 
  );
}

interface ItemFormProps {
  onSubmit: (description: string, amount: number) => void;
  onCancel: () => void;
  type: 'pengeluaran' | 'pemasukan';
}

function ItemForm({ onSubmit, onCancel, type }: ItemFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseFormattedNumber = (value: string) => {
    return parseInt(value.replace(/\./g, '')) || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFormattedNumber(amount);
    if (description.trim() && numericAmount > 0) {
      onSubmit(description.trim(), numericAmount);
      setDescription('');
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-3 rounded-lg mb-3 space-y-2">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Keterangan</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={`Masukkan keterangan ${type}...`}
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Jumlah</label>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(formatNumber(e.target.value))}
            className="w-full p-2 pl-8 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            required
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className={`px-3 py-1.5 text-sm text-white rounded font-medium ${
            type === 'pengeluaran' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          } transition-colors`}
        >
          Tambah
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm bg-gray-300 text-gray-700 rounded font-medium hover:bg-gray-400 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

const addMaximumScaleToMetaViewport = () => {
  const el = document.querySelector('meta[name=viewport]');

  if (el !== null) {
    let content = el.getAttribute('content');
    let re = /maximum\-scale=[0-9\.]+/g;

    if (re.test(content)) {
        content = content.replace(re, 'maximum-scale=1.0');
    } else {
        content = [content, 'maximum-scale=1.0'].join(', ')
    }

    el.setAttribute('content', content);
  }
};

const disableIosTextFieldZoom = addMaximumScaleToMetaViewport;

const checkIsIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (checkIsIOS()) {
  disableIosTextFieldZoom();
}
export default App;