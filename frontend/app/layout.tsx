import type { Metadata } from "next";
import "@/app/globals.css"; 
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer"; 

export const metadata: Metadata = {
  title: "MKeep - Gaming tâches",
  description: "Gestionnaire de tâches gamifié : XP, niveaux, streaks et succès.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Titan+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <AuthProvider>
          {/* Le contenu de vos pages prend tout l'espace disponible */}
          <main className="flex-1">
            {children}
          </main>
          
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
