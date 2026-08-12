"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@heroui/react";
import { ArrowLeftRight, Boxes, Building2, ChartNoAxesCombined, CircleDollarSign, Goal, Grid2X2, HelpCircle, Landmark, LayoutDashboard, LogOut, Menu, Package, PanelLeftClose, PanelLeftOpen, Plus, ReceiptText, Search, Settings, SlidersHorizontal, WalletCards } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { TransactionSheet } from "./transaction-sheet";
import { AppExperience } from "./onboarding";

const personal=[["/dashboard","Resumen",LayoutDashboard],["/transactions","Movimientos",ArrowLeftRight],["/accounts","Cuentas",WalletCards],["/budgets","Presupuestos",SlidersHorizontal],["/goals","Metas de ahorro",Goal],["/net-worth","Patrimonio",Landmark]] as const;
const business=[["/business","Resumen",Grid2X2],["/business/products","Productos",Package],["/business/inventory","Inventario",Boxes],["/business/cash-flow","Flujo de caja",ChartNoAxesCombined],["/business/ratios","Indicadores",CircleDollarSign],["/business/income-statement","Estado de resultados",ReceiptText],["/business/balance-sheet","Balance general",Building2]] as const;

export function AppShell({children}:{children:ReactNode}) {
  const path=usePathname(),router=useRouter();
  const {data,hydrated,demoMode,workspace,setWorkspace,setPeriod,hydrate,exitDemo,openDrawer,error,clearError}=useAppStore();
  const [collapsed,setCollapsed]=useState(false);
  useEffect(()=>{void hydrate()},[hydrate]);
  useEffect(()=>{setWorkspace(path.startsWith("/business")?"business":"personal")},[path,setWorkspace]);
  const switchWorkspace=(next:"personal"|"business")=>{setWorkspace(next);router.push(next==="business"?"/business":"/dashboard")};
  const leaveDemo=async()=>{await exitDemo();router.push("/")};
  const items=workspace==="business"?business:personal;
  const activeLabel=[...personal,...business].find(([href])=>path===href||href!=="/dashboard"&&path.startsWith(href))?.[1]??(path==="/settings"?"Configuración":path==="/help"?"Ayuda":"Nexo");
  return <div className={`app-shell ${collapsed?"sidebar-collapsed":""}`}>
    <aside className="sidebar">
      <div className="brand"><Link href="/dashboard" aria-label="Ir al Dashboard"><span className="brand-mark">n</span><strong>nexo</strong></Link><button aria-label={collapsed?"Expandir menú":"Contraer menú"} onClick={()=>setCollapsed(value=>!value)}>{collapsed?<PanelLeftOpen size={18}/>:<PanelLeftClose size={18}/>}</button></div>
      {demoMode&&<div className="demo-chip">Modo demo</div>}
      <div className="workspace-switch"><button className={workspace==="personal"?"active":""} onClick={()=>switchWorkspace("personal")}>Personal</button><button className={workspace==="business"?"active":""} onClick={()=>switchWorkspace("business")}>Mi negocio</button></div>
      <nav><p className="nav-label">{workspace==="personal"?"FINANZAS PERSONALES":"NEGOCIO"}</p>{items.map(([href,label,Icon])=><Link key={href} href={href} title={label} className={path===href||href!=="/dashboard"&&path.startsWith(href)?"nav-item active":"nav-item"}><Icon size={18}/><span>{label}</span></Link>)}</nav>
      <Link href="/help" title="Ayuda" className={path==="/help"?"nav-item active help-link":"nav-item help-link"}><HelpCircle size={18}/><span>Ayuda</span></Link>
      <Link href="/settings" title="Configuración" className={path==="/settings"?"nav-item active":"nav-item"}><Settings size={18}/><span>Configuración</span></Link>
      {demoMode&&<button className="nav-item demo-exit" onClick={()=>void leaveDemo()}><LogOut size={18}/><span>Salir de demo</span></button>}
    </aside>
    <main className="main"><header className="topbar"><strong>{activeLabel}</strong><div className="top-actions">{demoMode&&<span className="demo-chip">Modo demo</span>}<label className="top-control period-control"><span className="sr-only">Periodo financiero</span><input type="month" value={data.settings.selectedPeriod} onChange={event=>void setPeriod(event.target.value)}/></label><button className="top-control" aria-label="Buscar movimientos" onClick={()=>router.push("/transactions")}><Search size={15}/></button><span className="device-status"><span className="sync-dot"/> Guardado en este dispositivo</span><Button className="primary-button" onPress={()=>openDrawer()}><Plus size={17}/>Nuevo movimiento</Button></div></header>{error&&<div className="app-error" role="alert"><span>{error}</span><button type="button" onClick={clearError} aria-label="Cerrar aviso">×</button></div>}{hydrated?<div className="content">{children}</div>:<div className="content hydration-state" aria-busy="true"><div/><div/><div/></div>}</main>
    <nav className="mobile-nav"><Link href={workspace==="business"?"/business":"/dashboard"}><LayoutDashboard size={21}/><span>Inicio</span></Link><Link href={workspace==="business"?"/business/products":"/transactions"}>{workspace==="business"?<Package size={21}/>:<ArrowLeftRight size={21}/>}<span>{workspace==="business"?"Productos":"Movimientos"}</span></Link><button className="quick-add" onClick={()=>openDrawer()} aria-label="Nuevo movimiento"><Plus size={25}/></button><Link href={workspace==="business"?"/business/cash-flow":"/budgets"}><ChartNoAxesCombined size={21}/><span>Finanzas</span></Link><Link href="/settings"><Menu size={21}/><span>Más</span></Link></nav>
    {hydrated&&<><TransactionSheet/><AppExperience/></>}
  </div>;
}
