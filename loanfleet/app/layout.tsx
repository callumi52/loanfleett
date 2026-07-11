import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoanFleet",
  description: "LoanFleet dealership fleet management dashboard",
};

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: "◉" },
  { href: "/bookings", label: "Bookings", icon: "▣" },
  { href: "/fleet", label: "Fleet", icon: "⛟" },
  { href: "/customers", label: "Customers", icon: "◌" },
  { href: "/reports", label: "Reports", icon: "◫" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] text-slate-100">
        <div className="flex min-h-screen">
          <aside className="hidden w-64 flex-col border-r border-white/10 bg-slate-950/70 px-5 py-6 backdrop-blur lg:flex">
            <div className="mb-8 px-2">
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-sky-300">LoanFleet</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Operations Center</h2>
            </div>
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800/70 hover:text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-base">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
