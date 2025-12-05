import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';
import { TopUpTransaction, WithdrawalTransaction, User } from '@/types';
import { 
  Shield, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  XCircle,
  Clock,
  Users,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    topUps, 
    withdrawals, 
    confirmTopUp, 
    rejectTopUp,
    processWithdrawal,
    completeWithdrawal,
    loadTransactions 
  } = useTransactions();
  const { toast } = useToast();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    loadTransactions();
    const users = localStorage.getItem('qris_users');
    if (users) {
      setAllUsers(JSON.parse(users));
    }
  }, []);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user?.isAdmin) return null;

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserName = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    return user?.name || 'Unknown';
  };

  const handleConfirmTopUp = (transaction: TopUpTransaction) => {
    const confirmed = confirmTopUp(transaction.id);
    if (confirmed) {
      // Update user balance
      const users = JSON.parse(localStorage.getItem('qris_users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === transaction.userId);
      if (userIndex !== -1) {
        users[userIndex].balance += transaction.amount;
        localStorage.setItem('qris_users', JSON.stringify(users));
        setAllUsers(users);
      }

      toast({
        title: 'Berhasil',
        description: `Saldo ${formatCurrency(transaction.amount)} telah ditambahkan ke akun ${getUserName(transaction.userId)}`,
      });
      loadTransactions();
    }
  };

  const handleRejectTopUp = (transactionId: string) => {
    rejectTopUp(transactionId);
    toast({
      title: 'Ditolak',
      description: 'Transaksi top up telah ditolak',
      variant: 'destructive',
    });
    loadTransactions();
  };

  const handleProcessWithdrawal = (transactionId: string) => {
    processWithdrawal(transactionId);
    toast({
      title: 'Diproses',
      description: 'Request penarikan sedang diproses',
    });
    loadTransactions();
  };

  const handleCompleteWithdrawal = (transactionId: string) => {
    completeWithdrawal(transactionId);
    toast({
      title: 'Selesai',
      description: 'Penarikan telah diselesaikan',
    });
    loadTransactions();
  };

  const pendingTopUps = topUps.filter(t => t.status === 'waiting_confirmation');
  const pendingWithdrawals = withdrawals.filter(t => t.status === 'pending' || t.status === 'processing');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl gradient-primary glow">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Kelola transaksi dan pengguna</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingTopUps.length}</p>
                <p className="text-sm text-muted-foreground">Top Up Pending</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <ArrowDownRight className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingWithdrawals.length}</p>
                <p className="text-sm text-muted-foreground">Penarikan Pending</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{topUps.filter(t => t.status === 'confirmed').length}</p>
                <p className="text-sm text-muted-foreground">Top Up Selesai</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allUsers.length}</p>
                <p className="text-sm text-muted-foreground">Total Pengguna</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <Tabs defaultValue="topup" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="topup" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Top Up ({pendingTopUps.length})
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
              <ArrowDownRight className="w-4 h-4 mr-2" />
              Penarikan ({pendingWithdrawals.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Pengguna
            </TabsTrigger>
          </TabsList>

          {/* Top Up Tab */}
          <TabsContent value="topup">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4">Daftar Top Up</h3>
              
              {topUps.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Belum ada transaksi</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Tanggal</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Nominal</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Referensi</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Bukti</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topUps.map((tx) => (
                        <tr key={tx.id} className="border-b border-border/50">
                          <td className="py-3 px-2 text-sm">{formatDate(tx.createdAt)}</td>
                          <td className="py-3 px-2 text-sm">{getUserName(tx.userId)}</td>
                          <td className="py-3 px-2 text-sm font-medium">{formatCurrency(tx.amount)}</td>
                          <td className="py-3 px-2 text-sm font-mono text-xs">{tx.referenceNumber}</td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              tx.status === 'confirmed' ? 'text-green-500 bg-green-500/10' :
                              tx.status === 'waiting_confirmation' ? 'text-blue-500 bg-blue-500/10' :
                              tx.status === 'failed' ? 'text-red-500 bg-red-500/10' :
                              'text-yellow-500 bg-yellow-500/10'
                            }`}>
                              {tx.status === 'confirmed' ? 'Selesai' :
                               tx.status === 'waiting_confirmation' ? 'Menunggu' :
                               tx.status === 'failed' ? 'Gagal' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            {tx.proofImage && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedImage(tx.proofImage!)}
                              >
                                <ImageIcon className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                          <td className="py-3 px-2">
                            {tx.status === 'waiting_confirmation' && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="gradient-primary"
                                  onClick={() => handleConfirmTopUp(tx)}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRejectTopUp(tx.id)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </TabsContent>

          {/* Withdrawal Tab */}
          <TabsContent value="withdraw">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4">Daftar Penarikan</h3>
              
              {withdrawals.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Belum ada transaksi</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Tanggal</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">E-Wallet</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Nomor</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Nominal</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((tx) => (
                        <tr key={tx.id} className="border-b border-border/50">
                          <td className="py-3 px-2 text-sm">{formatDate(tx.createdAt)}</td>
                          <td className="py-3 px-2 text-sm">{getUserName(tx.userId)}</td>
                          <td className="py-3 px-2 text-sm uppercase font-medium">{tx.ewallet}</td>
                          <td className="py-3 px-2 text-sm font-mono">{tx.accountNumber}</td>
                          <td className="py-3 px-2 text-sm font-medium">{formatCurrency(tx.netAmount)}</td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              tx.status === 'completed' ? 'text-green-500 bg-green-500/10' :
                              tx.status === 'processing' ? 'text-blue-500 bg-blue-500/10' :
                              'text-yellow-500 bg-yellow-500/10'
                            }`}>
                              {tx.status === 'completed' ? 'Selesai' :
                               tx.status === 'processing' ? 'Diproses' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            {tx.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleProcessWithdrawal(tx.id)}
                              >
                                Proses
                              </Button>
                            )}
                            {tx.status === 'processing' && (
                              <Button 
                                size="sm" 
                                className="gradient-primary"
                                onClick={() => handleCompleteWithdrawal(tx.id)}
                              >
                                Selesai
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4">Daftar Pengguna</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Nama</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Saldo</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Terdaftar</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((u) => (
                      <tr key={u.id} className="border-b border-border/50">
                        <td className="py-3 px-2 text-sm font-medium">{u.name}</td>
                        <td className="py-3 px-2 text-sm">{u.email}</td>
                        <td className="py-3 px-2 text-sm font-medium">{formatCurrency(u.balance)}</td>
                        <td className="py-3 px-2 text-sm">{formatDate(u.createdAt)}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            u.isAdmin ? 'text-primary bg-primary/10' : 'text-muted-foreground bg-muted'
                          }`}>
                            {u.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-2xl glass-strong">
          <DialogHeader>
            <DialogTitle>Bukti Transfer</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Bukti Transfer" 
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
