import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "@heroui/react/styles";
import { AppFrame } from "@/components/app-frame";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

const geist=Geist({variable:"--font-geist-sans",subsets:["latin"]});
const publicUrl=process.env.NEXT_PUBLIC_APP_URL;

export const viewport:Viewport={width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#090d0c",colorScheme:"dark"};
export const metadata:Metadata={
  metadataBase:publicUrl?new URL(publicUrl):undefined,
  title:{default:"Nexo — Finanzas claras",template:"%s · Nexo"},
  description:"Finanzas personales y de negocio, conectadas en un solo lugar.",
  applicationName:"Nexo",
  appleWebApp:{capable:true,statusBarStyle:"black-translucent",title:"Nexo"},
  formatDetection:{telephone:false},
  icons:{icon:[{url:"/favicon.ico",sizes:"any"},{url:"/icons/icon-192.png",type:"image/png",sizes:"192x192"}],apple:[{url:"/icons/apple-touch-icon.png",type:"image/png",sizes:"180x180"}]},
  openGraph:{title:"Nexo — Finanzas claras",description:"Finanzas personales y de negocio, conectadas.",images:publicUrl?[{url:"/og.png",width:1200,height:630,alt:"Nexo — Finanzas claras"}]:undefined},
  twitter:{card:"summary_large_image",images:publicUrl?["/og.png"]:undefined},
};

export default function RootLayout({children}:LayoutProps<"/">){return <html lang="es" className={`${geist.variable} dark h-full antialiased`}><body className="min-h-full"><ServiceWorkerRegistration/><AppFrame>{children}</AppFrame></body></html>}
