import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UGC Tool Dashboard',
  description: 'UGC Prompt Generator with multi API',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-white">
        <div className="min-h-screen flex items-stretch bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
          <div className="flex-1">{children}</div>
        </div>
        <div aria-label="Notifications" className="fixed top-0 right-0 z-[100] p-4 pointer-events-none" />
      </body>
    </html>
  )
}
