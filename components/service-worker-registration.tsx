"use client";
import { useEffect } from "react";

export function ServiceWorkerRegistration(){useEffect(()=>{
  if(!("serviceWorker" in navigator))return;
  if(process.env.NODE_ENV!=="production"){
    void navigator.serviceWorker.getRegistrations().then(registrations=>Promise.all(registrations.map(registration=>registration.unregister())));
    return;
  }
  const register=async()=>{const registration=await navigator.serviceWorker.register("/sw.js",{scope:"/",updateViaCache:"none"});await registration.update()};
  if(document.readyState==="complete")void register();else window.addEventListener("load",register,{once:true});
  return()=>window.removeEventListener("load",register);
},[]);return null}
