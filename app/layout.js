import { Noto_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { Toaster } from 'sonner';

const noto = Noto_Sans({ subsets: ['latin', 'arabic'], weight: ['400', '700'] });

export const metadata = {
  title: 'Blog Summarizer',
  description: 'Summarize blogs and translate to Urdu',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={noto.className}>
        <Header />
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}