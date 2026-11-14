import "./assets/css/globals.css";
import "simplebar-react/dist/simplebar.min.css";
import TanstackProvider from "@/provider/providers.client";
import AuthProvider from "@/provider/auth.provider";
import "flatpickr/dist/flatpickr.min.css";
import DirectionProvider from "@/provider/direction.provider";
import { getSeoMeta } from "@/lib/get-seo-meta";
import { cn } from "@/lib/utils";
import { Toaster as ReactToaster } from "@/components/ui/toaster";
import { Toaster } from "react-hot-toast";
import { SonnToaster } from "@/components/ui/sonner";
import ThemeProvider from "@/provider/theme.provider";
import MountedProvider from "@/provider/mounted.provider";
import fontInter, { fontJakarta } from "@/config/font";
import DynamicFavicon from "@/components/common/dynamic-favicon";


export const metadata = getSeoMeta({
  title: "PT. Ditama Inti Teknologi",
  description: "Solusi IT Terintegrasi, Smart Gate System & General Supplier Industri",
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = "id";
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={cn("dash-tail-app bg-background text-foreground text-sm", fontInter.className, fontJakarta.variable, fontInter.variable)}>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="light"
          disableTransitionOnChange
        >
          <MountedProvider>
            <DynamicFavicon />
            <AuthProvider>
              <TanstackProvider>
                <DirectionProvider lang={lang}>{children}</DirectionProvider>
              </TanstackProvider>
            </AuthProvider>
          </MountedProvider>
          <ReactToaster />
          <Toaster />
          <SonnToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
