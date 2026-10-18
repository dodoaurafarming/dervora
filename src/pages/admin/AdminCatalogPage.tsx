import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2, ArrowLeft, FlaskConical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { isApiSuccess, adminListCatalog, adminDeleteCatalog, type IngredientCatalog } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { CatalogFormModal } from '../../components/admin/CatalogFormModal';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const AdminCatalogPage: React.FC = () => {
  const [data, setData] = useState<IngredientCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<IngredientCatalog | null>(null);
  
  // State untuk Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    // Batasi 20 data per halaman
    const res = await adminListCatalog({ search, page, limit: 20 });
    if (isApiSuccess(res)) {
      setData(res.data);
      // Ambil total halaman dari meta response
      if (res.meta && res.meta.totalPages) {
        setTotalPages(res.meta.totalPages);
      }
    } else {
      toast.error('Gagal memuat catalog');
    }
    setLoading(false);
  }, [search, page]);

  // Reset halaman ke 1 saat mencari
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 500);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus catalog "${name}"?`)) return;
    const res = await adminDeleteCatalog(id);
    if (isApiSuccess(res)) {
      toast.success('Catalog berhasil dihapus');
      // Jika menghapus data terakhir di halaman ini, mundurkan halaman
      if (data.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchData();
      }
    } else {
      toast.error('Gagal menghapus: ' + res.error.message);
    }
  };

  return (
    <AdminLayout>
      {/* Header & Tombol Kembali */}
      <div className="mb-6">
        <Link
          to="/dervora-control-9k2x/dashboard"
          className="inline-flex items-center gap-2 text-sm text-dervora-dark/60 hover:text-dervora-primary mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-dervora-primary font-heading">Kelola Ingredients (Catalog)</h1>
          <Button onClick={() => { setEditData(null); setModalOpen(true); }}>
            <Plus size={18} className="mr-2" /> Tambah Ingredient
          </Button>
        </div>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari nama bahan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-dervora-primary bg-white"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">ID</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Nama</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Kategori</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8">Memuat data...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8">Tidak ada data.</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">#{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt={item.name} className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <FlaskConical size={14} className="text-gray-400" />
                      </div>
                    )}
                    {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">{item.category || '-'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setEditData(item); setModalOpen(true); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 md:px-4 md:py-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            <span className="hidden md:inline">Sebelumnya</span>
          </button>
          
          <span className="text-sm font-medium text-gray-600">
            Halaman {page} dari {totalPages}
          </span>
          
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 md:px-4 md:py-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <span className="hidden md:inline">Selanjutnya</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <CatalogFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        editData={editData}
      />
    </AdminLayout>
  );
};