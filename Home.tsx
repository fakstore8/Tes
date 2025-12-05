import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Wallet, 
  QrCode, 
  ArrowUpRight, 
  Shield, 
  Zap, 
  Clock,
  Smartphone,
  CreditCard,
  TrendingUp
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: QrCode,
      title: 'QRIS Universal',
      description: 'Scan dan bayar dengan QRIS yang diterima di seluruh Indonesia',
    },
    {
      icon: Zap,
      title: 'Proses Cepat',
      description: 'Top up saldo dalam hitungan menit setelah konfirmasi',
    },
    {
      icon: Shield,
      title: 'Aman & Terpercaya',
      description: 'Transaksi terenkripsi dengan standar keamanan tinggi',
    },
    {
      icon: Clock,
      title: '24/7 Tersedia',
      description: 'Layanan tersedia kapan saja, di mana saja',
    },
  ];

  const ewallets = [
    { name: 'Dana', color: 'bg-blue-500' },
    { name: 'OVO', color: 'bg-purple-500' },
    { name: 'GoPay', color: 'bg-green-500' },
    { name: 'ShopeePay', color: 'bg-orange-500' },
    { name: 'LinkAja', color: 'bg-red-500' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Platform Top Up Saldo #1</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Top Up Saldo dengan{' '}
              <span className="gradient-text">QRIS</span>
              {' '}Mudah & Cepat
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Isi saldo e-wallet Anda menggunakan QRIS. Proses instan, 
              aman, dan dapat dicairkan kapan saja ke berbagai e-wallet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button 
                size="lg" 
                className="gradient-primary text-lg px-8 glow"
                onClick={() => navigate(user ? '/topup' : '/register')}
              >
                {user ? 'Isi Saldo Sekarang' : 'Mulai Sekarang'}
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8"
                onClick={() => navigate('/help')}
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Kenapa Pilih <span className="gradient-text">QRISPay</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Platform top up saldo terpercaya dengan berbagai keunggulan
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <GlassCard key={index} hover className="text-center">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cara <span className="gradient-text">Kerja</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, icon: QrCode, title: 'Scan QRIS', desc: 'Masukkan nominal dan scan QRIS untuk pembayaran' },
              { step: 2, icon: CreditCard, title: 'Upload Bukti', desc: 'Upload bukti transfer untuk konfirmasi' },
              { step: 3, icon: Wallet, title: 'Saldo Masuk', desc: 'Saldo masuk ke akun setelah dikonfirmasi admin' },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 glow">
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="absolute top-8 left-[60%] w-[80%] h-0.5 bg-primary/20 hidden md:block last:hidden" />
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                  Langkah {item.step}
                </span>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E-Wallets */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cairkan ke <span className="gradient-text">E-Wallet</span> Favoritmu
            </h2>
            <p className="text-muted-foreground">
              Tarik saldo ke berbagai e-wallet dengan mudah
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {ewallets.map((wallet) => (
              <div 
                key={wallet.name}
                className="flex items-center gap-3 px-6 py-3 rounded-xl glass hover:scale-105 transition-transform"
              >
                <div className={`w-10 h-10 rounded-lg ${wallet.color} flex items-center justify-center`}>
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">{wallet.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <GlassCard className="max-w-3xl mx-auto text-center py-12">
            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Mulai Top Up Sekarang
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Bergabung dengan ribuan pengguna yang sudah menikmati kemudahan top up saldo via QRIS
            </p>
            <Button 
              size="lg" 
              className="gradient-primary px-8 glow"
              onClick={() => navigate(user ? '/topup' : '/register')}
            >
              {user ? 'Isi Saldo' : 'Daftar Gratis'}
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </Button>
          </GlassCard>
        </div>
      </section>
    </Layout>
  );
}
