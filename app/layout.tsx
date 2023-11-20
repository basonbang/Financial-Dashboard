import '@/app/ui/global.css'; // ⭐ Good practice to import CSS to top-level component
import { inter } from '@/app/ui/fonts'; 
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

// Defines 'RootLayout' component. Wraps all child components in <html> and <body> tags.
export default function RootLayout({
  children, // takes children prop
}: {
  children: React.ReactNode;  // TS: ensures children are valid React node; used to render child components
}) {
  return ( // Where child components passed to 'RootLayout' are displayed
    <html lang="en">
      <body className={`${inter.className} antialiasaed`}>{children}</body> {/* Apply Inter font throughout App */}
    </html>
  );
}
