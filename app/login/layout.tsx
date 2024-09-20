// app/login/layout.tsx

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="bg-gray-100 min-h-screen w-full flex items-center justify-center p-0">
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
