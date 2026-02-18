import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NIfTI Browser Viewer',
  description: '3D Slicer-like medical imaging viewer for NIfTI files in browser',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
