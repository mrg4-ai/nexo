"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "./app-shell";

export function AppFrame({children}:{children:ReactNode}) {
  const pathname=usePathname();
  return pathname==="/"?children:<AppShell>{children}</AppShell>;
}
