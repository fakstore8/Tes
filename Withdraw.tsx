import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ArrowDownRight, User, Phone, CheckCircle2 } from 'lucide-react';

const ADMIN_FEE_PERCENTAGE = 2.5;

const EWALLETS = [
  { id: 'dana', name: 'Dana', color: 'bg-blue-500' },
  { id: 'ovo', name: 'OVO', color: 'bg-purple-500' },
  { id: 'gopay', name: 'GoPay', color: 'bg-green-500' },
  { id: 'shopeepay', name: 'ShopeePay', color: 'bg-orange-500' },
  { id: 'linkaja', name: 'LinkAja', color: 'bg-red-500' },
];

export default function Withdraw() {
  const navigate = useNavigate();
  const { user, updateBalance } = useAuth();
  const { createWithdrawal } = useTransactions();
  const { toast } = useToast();
  
  const [ewallet, setEwallet] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const numAmount = parseInt(amount) || 0;
  const adminFee = Math.round(numAmount * (ADMIN_FEE_PERCENTAGE / 100));
  const netAmount = numAmount - adminFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!ewallet) {
      toast({
        title: 'Error',
        description: 'Pilih e-wallet tujuan',
        variant: 'destructive',
      });
      return;
    }

    if (!accountNumber || accountNumber.length < 10) {
      toast({
        title: 'Error',
        description: 'Nomor e-wallet tidak valid',
        variant: 'destructive',
      });
      return;
    }

    if (!accountName.trim()) {
      toast({
        title: 'Error',
        description: 'Nama penerima harus diisi',
        variant: 'destructive',
      });
      return;
    }

    if (numAmount < 10000) {
      toast({
        title: 'Error',
        description: 'Minimal penarikan Rp 10.000',
        variant: 'destructive',
      });
      return;
    }

    if (numAmount > user.balance) {
      toast({
        title: 'Error',
        description: 'Saldo tidak mencukupi',
        variant: 'destructive',
      });
      return;
    }

    createWithdrawal({
      userId: user.id,
      amount: numAmount,
      ewallet: ewallet as any,
      accountNumber,
      accountName: accountName.trim(),
      adminFee,
    }, ADMIN_FEE_PERCENTAGE);

    updateBalance(user.balance - numAmount);

    toast({
      title: 'Berhasil',
      description: 'Request penarikan berhasil dibuat',
    });

    setIsSubmitted(true);
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <GlassCard className="max-w-md mx-auto">
            <Wallet className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Login Diperlukan</h2>
            <p className="text-muted-foreground mb-6">
              Silakan login untuk menarik saldo.
            </p>
            <Button onClick={() => navigate('/login')} className="gradient-primary">
              Masuk
            </Button>
          </GlassCard>
        </div>
      </Layout>
    );
  }

  if (isSubmitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <GlassCard className="max-w-md mx-auto text-center animate-slide-up">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Request Penarikan Berhasil!</h2>
            <p className="text-muted-foreground mb-6">
              Request penarikan Anda sedang diproses. Dana akan dikirim ke akun {ewallet.toUpperCase()} Anda dalam 1x24 jam.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button className="gradient-primary" onClick={() => {
                setIsSubmitted(false);
                setAmount('');
                setAccountNumber('');
                setAccountName('');
                setEwallet('');
              }}>
                Tarik Lagi
              </Button>
            </div>
          </GlassCard>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow">
              <ArrowDownRight className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Tarik Saldo</h1>
            <p className="text-muted-foreground mt-2">
              Cairkan saldo ke e-wallet favorit Anda
            </p>
          </div>

          {/* Balance Info */}
          <GlassCard className="mb-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Tersedia</p>
                  <p className="text-2xl font-bold gradient-text">{formatCurrency(user.balance)}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* E-Wallet Selection */}
              <div className="space-y-3">
                <Label>Pilih E-Wallet</Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {EWALLETS.map((wallet) => (
                    <button
                      key={wallet.id}
                      type="button"
                      onClick={() => setEwallet(wallet.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        ewallet === wallet.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${wallet.color} mx-auto mb-2 flex items-center justify-center`}>
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-medium">{wallet.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Nomor E-Wallet</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="accountNumber"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    className="pl-10"
                    maxLength={15}
                  />
                </div>
              </div>

              {/* Account Name */}
              <div className="space-y-2">
                <Label htmlFor="accountName">Nama Penerima</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="accountName"
                    placeholder="Nama sesuai e-wallet"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Nominal Penarikan</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Minimal 10.000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    min="10000"
                    max={user.balance}
                  />
                </div>
              </div>

              {/* Summary */}
              {numAmount >= 10000 && (
                <div className="p-4 rounded-xl bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nominal</span>
                    <span>{formatCurrency(numAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Biaya Admin ({ADMIN_FEE_PERCENTAGE}%)</span>
                    <span className="text-destructive">-{formatCurrency(adminFee)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span>Diterima</span>
                    <span className="text-primary">{formatCurrency(netAmount)}</span>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full gradient-primary text-lg py-6"
                disabled={numAmount < 10000 || numAmount > user.balance}
              >
                Tarik Saldo
                <ArrowDownRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
}
