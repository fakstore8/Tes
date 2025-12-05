import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';

const faqs = [
  {
    question: 'Bagaimana cara melakukan top up saldo?',
    answer: 'Untuk melakukan top up, login ke akun Anda, pilih menu "Isi Saldo", masukkan nominal yang diinginkan, dan ikuti instruksi pembayaran via QRIS. Setelah transfer, upload bukti pembayaran dan tunggu konfirmasi admin.',
  },
  {
    question: 'Berapa lama proses konfirmasi top up?',
    answer: 'Proses konfirmasi top up biasanya memakan waktu 5-30 menit pada jam kerja. Di luar jam kerja, proses bisa memakan waktu hingga 24 jam.',
  },
  {
    question: 'Minimal top up berapa?',
    answer: 'Minimal top up adalah Rp 10.000.',
  },
  {
    question: 'Bagaimana cara menarik saldo?',
    answer: 'Pilih menu "E-Wallet", pilih e-wallet tujuan (Dana, OVO, GoPay, ShopeePay, atau LinkAja), masukkan nomor dan nama penerima, lalu masukkan nominal penarikan. Saldo akan dikirim dalam 1x24 jam.',
  },
  {
    question: 'Berapa biaya admin penarikan?',
    answer: 'Biaya admin penarikan adalah 2.5% dari nominal penarikan.',
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Ya, semua data Anda disimpan dengan enkripsi dan tidak akan dibagikan ke pihak ketiga.',
  },
  {
    question: 'Bagaimana jika pembayaran saya tidak terkonfirmasi?',
    answer: 'Pastikan Anda sudah mengupload bukti transfer yang jelas. Jika setelah 24 jam belum dikonfirmasi, silakan hubungi customer service kami.',
  },
];

export default function Help() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow">
              <HelpCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Bantuan & FAQ</h1>
            <p className="text-muted-foreground mt-2">
              Temukan jawaban dari pertanyaan yang sering diajukan
            </p>
          </div>

          {/* FAQ */}
          <GlassCard className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Pertanyaan Umum</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlassCard>

          {/* Contact */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-4">Hubungi Kami</h2>
            <p className="text-muted-foreground mb-6">
              Masih ada pertanyaan? Hubungi tim support kami.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">+62 812-xxxx-xxxx</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">support@qrispay.id</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Telepon</p>
                  <p className="text-sm text-muted-foreground">(021) xxxx-xxxx</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
}
