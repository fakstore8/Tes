import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Wallet, User, FileText, ArrowRight } from 'lucide-react';

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

export default function TopUp() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTopUp } = useTransactions();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState('');
  // [MODIFIKASI] Gunakan user.name sebagai nilai default
  const [recipientName, setRecipientName] = useState(user?.name || 'Nama QRIS Anda'); 
  const [note, setNote] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const handlePresetClick = (value: number) => {
    setAmount(String(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount);

    if (isNaN(numAmount) || numAmount < 10000) {
      toast({
        title: 'Error',
        description: 'Nominal top up minimal Rp 10.000.',
        variant: 'destructive',
      });
      return;
    }

    if (!recipientName.trim()) {
        toast({
            title: 'Error',
            description: 'Nama di QRIS harus diisi.',
            variant: 'destructive',
        });
        return;
    }

    const newTransaction = createTopUp({
      userId: user!.id,
      amount: numAmount,
      // [MODIFIKASI] Kirim recipientName yang sudah diubah/default
      recipientName: recipientName.trim(), 
      note: note || '',
      proof: null,
    });

    toast({
      title: 'Transaksi Dibuat',
      description: 'Lanjutkan ke halaman pembayaran.',
    });
    
    navigate(`/payment/${newTransaction.id}`);
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <QrCode className="w-8 h-8 text-primary" />
            Isi Saldo
          </h1>

          <GlassCard className="animate-slide-up">
            <h2 className="text-xl font-bold mb-6">Pilih Nominal</h2>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {PRESET_AMOUNTS.map((value) => (
                <Button 
                  key={value}
                  variant={amount === String(value) ? 'default' : 'outline'}
                  onClick={() => handlePresetClick(value)}
                  className="py-6 text-sm"
                >
                  {formatCurrency(value)}
                </Button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              {/* Input Manual Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Atau masukkan jumlah lain (Min 10.000)</Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Contoh: 75000"
                    min="10000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 text-lg py-6"
                  />
                </div>
              </div>

              {/* [MODIFIKASI] Input Nama di QRIS */}
              <div className="space-y-2">
                <Label htmlFor="recipientName">Nama di QRIS (Bisa Diubah)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="recipientName"
                    placeholder="Nama Pengguna Anda"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Nama ini akan ditampilkan sebagai overlay pada QRIS.
                </p>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note">Catatan (Opsional)</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Textarea
                    id="note"
                    placeholder="Tambahkan catatan..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="pl-10 min-h-[80px]"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gradient-primary text-lg py-6">
                Lanjut ke Pembayaran
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
}
