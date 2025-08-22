import "@/styles/globals.css";
import type { Metadata } from "next";

import { META_THEME_COLORS, siteConfig } from "@/config/site";
import { fontMono, fontSans } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { TailwindIndicator } from "@/ui/tailwind-indicator";
import { AnalyticsProvider } from "@/components/analytics-provider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    "Ulm",
    "Ulm University",
    "Universität Ulm",
    "Ulmiversität",
    "Ulmiversitaet",
  ],
  authors: [
    {
      name: "Jan Bulling",
      url: "https://jan-bulling.com",
    },
    { name: "Stefan Rau" },
  ],
  creator: "Jan Bulling",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="de" suppressContentEditableWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body
        className={cn(
          "bg-background text-foreground min-h-svh font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <ThemeProvider>
          <div className="relative flex min-h-svh flex-col">{children}</div>
          <TailwindIndicator />
          <AnalyticsProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
