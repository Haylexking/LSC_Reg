import "./globals.css";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LSC Tech Hub Bootcamp Registration',
  description: 'Register for the LSC Tech Hub Bootcamp',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Work Sans via Google Fonts - kept in layout head so font loads early */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-display min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <header className="bg-card-light dark:bg-card-dark shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="text-primary h-8 w-8">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h1 className="text-lg font-bold text-foreground-light dark:text-foreground-dark">LSC Tech Hub Bootcamp</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  )
}
