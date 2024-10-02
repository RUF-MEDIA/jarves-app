// app/kunden/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sales',
  description: 'p',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full">{children}</div>;
}
