import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Plus
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserTopUps, getUserWithdrawals, loadTransactions } = useTransactions();

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const topUps = getUserTopUps(user.id);
  const withdrawals = getUserWithdrawals(user.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { icon: typeof Clock; color: string; label: string }> = {
      pending: { icon: Clock, color: 'text-yellow-500 bg-yellow-500/10', label: 'Menunggu' },
      waiting_confirmation: { icon: Clock, color: 'text-blue-500 bg-blue-500/10', label: 'Menunggu Konfirmasi' },
      confirmed: { icon: CheckCircle2, color: 'text-green-500 bg-green-500/10', label: 'Selesai' },
      completed: { icon: CheckCircle2, color: 'text-green-500 bg-green-500/10', label: 'Selesai' },
      processing: { icon: Clock, color: 'text-blue-500 bg-blue-500/10', label: 'Diproses' },
      failed: { icon: AlertCircle, color: 'text-red-500 bg-red-500/10', label: 'Gagal' },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const totalTopUp = topUps
    .filter(t => t.status === 'confirmed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdraw = withdrawals
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Selamat datang, {user.name}!</h1>
          <p className="text-muted-foreground">Kelola saldo dan transaksi Anda</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">Saldo Saat Ini</p>
            <p className="text-3xl font-bold gradient-text">{formatCurrency(user.balance)}</p>
          </GlassCard>

          <GlassCard className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <ArrowUpRight className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Total Top Up</p>
            <p className="text-2xl font-bold">{formatCurrency(totalTopUp)}</p>
          </GlassCard>

          <GlassCard className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <ArrowDownRight className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Total Penarikan</p>
            <p className="text-2xl font-bold">{formatCurrency(totalWithdraw)}</p>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Button onClick={() => navigate('/topup')} className="gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Isi Saldo
          </Button>
          <Button onClick={() => navigate('/withdraw')} variant="outline">
            <ArrowDownRight className="w-4 h-4 mr-2" />
            Tarik Saldo
          </Button>
        </div>

        {/* Transaction History */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Up History */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-green-500" />
              Riwayat Top Up
            </h3>
            
            {topUps.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Belum ada transaksi top up</p>
            ) : (
              <div className="space-y-3">
                {topUps.slice(0, 5).map((tx) => (
                  <div 
                    key={tx.id}
                    onClick={() => navigate(`/payment/${tx.id}`)}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-medium">{formatCurrency(tx.amount)}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(tx.createdAt)}</p>
                    </div>
                    {getStatusBadge(tx.status)}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Withdrawal History */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5 text-blue-500" />
              Riwayat Penarikan
            </h3>
            
            {withdrawals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Belum ada transaksi penarikan</p>
            ) : (
              <div className="space-y-3">
                {withdrawals.slice(0, 5).map((tx) => (
                  <div 
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{formatCurrency(tx.amount)}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {tx.ewallet} - {tx.accountNumber}
                      </p>
                    </div>
                    {getStatusBadge(tx.status)}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
}
