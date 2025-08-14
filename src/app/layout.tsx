import './globals.css'

export const metadata = {
  title: 'ManagAI Platform',
  description: 'AI-powered e-commerce automation platform',
  icons: [
    { rel: 'icon', url: '/icon.png', sizes: '32x32', type: 'image/png' },
    { rel: 'shortcut icon', url: '/icon.png', sizes: '32x32', type: 'image/png' },
    { rel: 'apple-touch-icon', url: '/icon.png', sizes: '32x32', type: 'image/png' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" sizes="32x32" type="image/png" />
        <link rel="shortcut icon" href="/icon.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" sizes="32x32" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
