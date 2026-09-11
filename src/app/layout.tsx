import type { Metadata } from 'next';
import './globals.css';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { CompareProvider } from '@/context/CompareContext';
import FloatingCompareBar from '@/components/FloatingCompareBar';

export const metadata: Metadata = {
  title: 'MotorHub | Flota Seleccionada • Garantía Certificada',
  description: 'MotorHub - Vehículos seleccionados y certificados: automóviles premium, utilitarios, motocicletas, embarcaciones y motorhomes con peritaje integral.',
  icons: {
    icon: [
      { url: '/logo.png', sizes: 'any' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
        <CompareProvider>
          {children}
          <FloatingCompareBar />
          <FloatingWhatsApp />
        </CompareProvider>
      </body>
    </html>
  );
}
