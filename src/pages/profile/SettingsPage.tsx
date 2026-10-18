import React from 'react';
import { ArrowLeft, Trash2, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQuizStore } from '../../store/quizStore';
import { useRoutineStore } from '../../store/routineStore';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Menggunakan nama fungsi yang benar dari store
  const { reset } = useQuizStore(); 
  const { clearRoutine } = useRoutineStore();

  const handleResetQuiz = () => {
    if (window.confirm('Yakin ingin menghapus data Skin Profile? Anda harus mengulang quiz.')) {
      reset();
      toast.success('Data Skin Profile berhasil dihapus.');
      navigate('/profile');
    }
  };

  const handleClearRoutine = () => {
    if (window.confirm('Yakin ingin menghapus semua produk dari rutinitas Anda?')) {
      clearRoutine();
      toast.success('Rutinitas berhasil dikosongkan.');
    }
  };

  return (
    <div className="min-h-screen bg-dervora-cream px-6 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-dervora-dark/60 hover:text-dervora-primary mb-6">
          <ArrowLeft size={16} /> Kembali ke Profil
        </Link>
        
        <h1 className="font-heading text-3xl font-bold text-dervora-primary mb-8">
          Pengaturan
        </h1>

        <div className="bg-white rounded-3xl shadow-sm border border-dervora-beige overflow-hidden">
          <div className="p-6 md:p-8 border-b border-dervora-beige">
            <h2 className="font-heading text-xl font-bold text-dervora-dark mb-2">Data Pribadi</h2>
            <p className="font-body text-sm text-dervora-dark/60 mb-4">
              Kelola data yang tersimpan di perangkat Anda.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="font-body font-medium text-red-800">Hapus Data Skin Profile</p>
                  <p className="font-body text-xs text-red-600/70">Anda perlu mengulang quiz setelah ini.</p>
                </div>
                <button onClick={handleResetQuiz} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="font-body font-medium text-red-800">Kosongkan Rutinitas</p>
                  <p className="font-body text-xs text-red-600/70">Semua produk di rutinitas akan dihapus.</p>
                </div>
                <button onClick={handleClearRoutine} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-gray-50 flex items-start gap-4">
            <ShieldAlert className="text-gray-400 mt-1" size={24} />
            <div>
              <h3 className="font-body font-semibold text-gray-700">Privasi Anda Terjamin</h3>
              <p className="font-body text-sm text-gray-500 mt-1 leading-relaxed">
                Dervora menyimpan data rutinitas dan hasil quiz Anda secara lokal di browser (Local Storage). Kami tidak mengirim data ini ke server manapun tanpa izin Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};