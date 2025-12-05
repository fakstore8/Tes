import { useState, useEffect } from 'react'; // Tambahkan useEffect
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ArrowRight, Chrome } from 'lucide-react'; 

// [BARU] Import GOOGLE_CLIENT_ID dari file konfigurasi
import { GOOGLE_CLIENT_ID } from '@/config/appConfig'; 

export default function Register() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth(); 
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // [BARU] useEffect untuk inisialisasi Google SDK
  // Ini menunjukkan di mana Client ID akan digunakan untuk mengatur Google Sign-In.
  useEffect(() => {
    // Pastikan Anda telah memuat Google Identity Services script di index.html:
    // <script src="https://accounts.google.com/gsi/client" async defer></script>
    
    console.log(`Google Client ID yang dimuat: ${GOOGLE_CLIENT_ID}`);

    /*
    // Contoh implementasi nyata menggunakan Google Identity Services SDK:
    if (window.google && GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse, // Ganti dengan fungsi penanganan token Anda
      });
      // Jika Anda menggunakan Google SDK Button (One-Tap atau GSI button):
      // window.google.accounts.id.renderButton(
      //   document.getElementById("googleSignInButton"),
      //   { theme: "outline", size: "large", text: "continue_with" }
      // );
    }
    */
  }, []);

  // Fungsi untuk mensimulasikan proses login Google
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Dalam aplikasi nyata, Anda akan memanggil SDK Google atau backend di sini
      // untuk mendapatkan token/credential sebelum memprosesnya dengan `loginWithGoogle`.
      const mockUser = {
        name: 'Pengguna Google Baru', 
        email: `user_${Date.now()}@google.com`, 
      };
      
      const user = await loginWithGoogle(mockUser.name, mockUser.email);
      
      toast({
        title: 'Berhasil Masuk',
        description: `Selamat datang, ${user.name}!`,
      });
      navigate('/dashboard'); 
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal masuk dengan Google. Coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <GlassCard className="max-w-md w-full p-8 animate-slide-up">
          <div className="text-center mb-8">
            <Wallet className="w-10 h-10 text-primary mx-auto mb-2" />
            <h2 className="text-2xl font-bold">Gabung Sekarang</h2>
            <p className="text-muted-foreground">Masuk/Daftar menggunakan Google untuk melanjutkan.</p>
          </div>
          
          {/* Container ini bisa digunakan oleh Google SDK untuk merender tombol asli */}
          <div id="googleSignInButton" className='w-full'> 
            <Button 
              onClick={handleGoogleLogin}
              className="w-full bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              <Chrome className="mr-2 w-5 h-5" />
              {isLoading ? 'Memproses...' : 'Masuk/Daftar dengan Google (Simulasi)'}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Atau masuk dengan akun email biasa?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Masuk
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
}
