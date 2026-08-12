"use client";

import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { Card, PageHeader } from "./ui";

export function ProfileSettings() {
  const {data,saveProfile,setGuideCompleted,demoMode,resetDemo}=useAppStore();
  const [editing,setEditing]=useState(false);
  const [name,setName]=useState(data.profile?.name??"");
  const [error,setError]=useState("");
  const save=async()=>{try{await saveProfile(name);setEditing(false);setError("")}catch(reason){setError(reason instanceof Error?reason.message:"No se pudo actualizar el nombre.")}};
  return <section className="profile-settings"><PageHeader title="Perfil y guía" description="Tu identidad local y las ayudas para comenzar."/><Card id="profile"><div className="settings-row"><div><h3>Nombre</h3><p>Se utiliza únicamente para personalizar tu saludo en este dispositivo.</p></div>{editing?<div className="profile-editor"><Input aria-label="Nombre" value={name} maxLength={60} onChange={event=>setName(event.target.value)}/><Button className="primary-button" onPress={save}>Guardar</Button><Button className="secondary-button" onPress={()=>{setEditing(false);setName(data.profile?.name??"")}}>Cancelar</Button></div>:<div className="profile-value"><strong>{data.profile?.name??"Sin configurar"}</strong><Button className="secondary-button" onPress={()=>setEditing(true)}>Editar</Button></div>}</div>{error&&<p className="form-error" role="alert">{error}</p>}<div className="settings-actions profile-actions"><Button className="secondary-button" onPress={()=>void setGuideCompleted(false)}>Ver guía inicial</Button>{demoMode&&<Button className="secondary-button" onPress={()=>{if(confirm("¿Restablecer únicamente los datos de demostración?"))void resetDemo()}}>Restablecer demo</Button>}</div></Card></section>;
}
