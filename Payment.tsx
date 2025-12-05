import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTransactions } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';
import { 
  QrCode, 
  Clock, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Image as ImageIcon,
  User // [BARU] Import User untuk icon nama QRIS
} from 'lucide-react';

// QRIS base64 placeholder - in production this would be the actual QRIS image
const QRIS_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjgiIGZpb...'; // Placeholder disingkat

export default function Payment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTopUpById, uploadProof, confirmTopUpManually } = useTransactions(); // Asumsi confirmTopUpManually ada
  const { toast } = useToast();
  
  const [transaction, setTransaction] = useState(getTopUpById(id || ''));
  const [timeLeft, setTimeLeft] = useState(3600); // 1 jam
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ... (formatCurrency dan formatTimeLeft)

  useEffect(() => {
    const tx = getTopUpById(id || '');
    if (!tx) {
      toast({
        title: 'Error',
        description: 'Transaksi tidak ditemukan.',
        variant: 'destructive',
      });
      navigate('/topup');
    }
    setTransaction(tx);
    
    // Timer logika (dihilangkan untuk fokus pada kode)
    // ...
  }, [id, getTopUpById, navigate, toast]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'Error',
          description: 'Ukuran file terlalu besar. Maksimal 5MB.',
          variant: 'destructive',
        });
        return;
      }
      setProofFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleConfirmPayment = async () => {
    if (!proofFile || !transaction) return;

    setIsUploading(true);
    try {
      // Simulasi upload
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      const uploadedProofUrl = URL.createObjectURL(proofFile); // Ganti dengan URL upload sebenarnya
      
      // Update status transaksi
      const updatedTx = uploadProof(transaction.id, uploadedProofUrl);
      setTransaction(updatedTx);

      toast({
        title: 'Bukti Terunggah',
        description: 'Pembayaran sedang dikonfirmasi. Harap tunggu.',
      });
    } catch (error) {
      toast({
        title: 'Error Upload',
        description: 'Gagal mengunggah bukti transfer.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!transaction) return <p className="text-center">Memuat transaksi...</p>;

  const isConfirmed = transaction.status === 'confirmed';
  const isFailed = transaction.status === 'failed';
  const isWaiting = transaction.status === 'waiting_confirmation';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <QrCode className="w-8 h-8 text-primary" />
          Pembayaran Top Up
        </h1>

        <div className="max-w-2xl mx-auto">
          {transaction.status === 'pending' && (
            <GlassCard className="animate-slide-up">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <QrCode className="w-6 h-6 text-primary" />
                Lakukan Pembayaran
              </h3>
              
              <div className="space-y-4 mb-6">
                {/* [BARU] TAMPILKAN NAMA DI QRIS */}
                <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Nama Akun QRIS
                    </span>
                    <span className="font-semibold text-primary">{transaction.recipientName}</span>
                </div>
                {/* TAMPILKAN JUMLAH TRANSAKSI */}
                <div className="flex justify-between items-center p-3 rounded-xl bg-primary/10">
                    <span className="text-lg font-semibold text-primary">Jumlah Pembayaran</span>
                    <span className="text-xl font-bold text-primary">{formatCurrency(transaction.amount)}</span>
                </div>
              </div>

              {/* ... (QRIS IMAGE, Batas Waktu, Petunjuk Pembayaran yang sudah ada) */}
              
              <h4 className="font-bold mt-8 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Unggah Bukti Transfer
              </h4>

              {/* [KONFIRMASI] BAGIAN UPLOAD BUKTI TRANSFER (Fitur ini sudah ada di file Anda) */}
              <div className="mt-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".jpg,.jpeg,.png"
                />
                
                {previewUrl ? (
                    <div className="border border-border rounded-xl p-4 flex items-center justify-between bg-white/50">
                        <div className='flex items-center gap-3'>
                            <img src={previewUrl} alt="Bukti Transfer" className="w-16 h-16 object-cover rounded-md" />
                            <div>
                                <p className="font-medium">{proofFile?.name}</p>
                                <p className="text-sm text-muted-foreground">Siap diunggah</p>
                            </div>
                        </div>
                        <Button variant="ghost" onClick={() => setPreviewUrl(null)}>Ubah</Button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium mb-2">Klik untuk upload bukti transfer</p>
                      <p className="text-sm text-muted-foreground">
                        Format: JPG, PNG (Maks. 5MB)
                      </p>
                    </div>
                  )}
                
                <Button 
                  onClick={handleConfirmPayment}
                  disabled={!proofFile || isUploading}
                  className="w-full gradient-primary mt-4"
                >
                  {isUploading ? 'Mengunggah...' : 'Konfirmasi Pembayaran'}
                </Button>
              </div>

            </GlassCard>
          )}

          {/* ... (Bagian status waiting_confirmation, confirmed, failed yang sudah ada) */}
        </div>
      </div>
    </Layout>
  );
}
