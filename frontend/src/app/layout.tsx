import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { RealtimeToastProvider } from '@/components/realtime-toast-provider';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { ColdStartBanner } from '@/components/ui/state-kit';

export const metadata: Metadata = {
  title: 'SkillBounty - Micro-Bounty & Portfolio Matcher Platform',
  description: 'Platform micro-bounty berbasis proof-of-work dan automated escrow untuk talenta muda dan UMKM.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Montserrat:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground min-h-screen flex flex-col antialiased selection:bg-primary/30 selection:text-primary-fixed">
        <AppProvider>
          <RealtimeToastProvider>
            <Navbar />
            <div className="pt-16">
              <ColdStartBanner />
              <main className="flex-grow min-h-[calc(100vh-16rem)]">
                {children}
              </main>
              <Footer />
            </div>
          </RealtimeToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
