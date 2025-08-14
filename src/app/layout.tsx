import './globals.css'

export const metadata = {
  title: 'ManagAI Platform',
  description: 'AI-powered e-commerce automation platform',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
