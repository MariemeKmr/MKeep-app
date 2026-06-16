"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Trophy, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <span className="logo-mkeep animate-float text-5xl">MKeep</span>
      </div>
    );
  }

  const nav = [
    { href: "/dashboard", label: "Tâches", icon: LayoutGrid },
    { href: "/dashboard/achievements", label: "Succès", icon: Trophy },
  ];

  return (
    <>

      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 pb-28 pt-8 sm:px-7 sm:pb-12">
        {/* Logo MKeep en grand */}
        <header className="mb-6 flex flex-col items-center text-center">
          <Link href="/dashboard" aria-label="MKeep - accueil">
            <span className="logo-mkeep text-6xl sm:text-7xl">MKeep</span>
          </Link>
          <p className="mt-1 font-display text-base font-500 text-muted sm:text-lg">
            Votre <span className="font-700 text-pink">funny</span> gestionnaire de tâches
          </p>
        </header>

        {/* Barre de contrôle : nav (desktop) + déconnexion */}
        <div className="mb-6 flex items-center justify-between gap-2">
          <nav className="hidden gap-2 sm:flex">
            {nav.map((n) => {
              const active = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`btn px-4 py-2 text-sm ${active ? "bg-primary text-white" : "bg-white text-ink"}`}
                >
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={logout} className="btn-ghost ml-auto px-4 py-2 text-sm">
            <LogOut className="h-4 w-4" /> Quitter
          </button>
        </div>

        <main className="flex-1">{children}</main>
      </div>

      {/* Navigation mobile (barre du bas) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center gap-3 border-t-[3px] border-ink bg-white p-3 sm:hidden">
        {nav.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`btn flex-1 px-3 py-2 text-sm ${active ? "bg-primary text-white" : "bg-white text-ink"}`}
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
