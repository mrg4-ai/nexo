"use client";

import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { useAppStore } from "@/stores/app-store";

const steps=[
  ["Tu dinero de un vistazo","El Dashboard reúne saldos, ingresos, gastos, presupuesto y patrimonio para el periodo seleccionado."],
  ["Registra tus movimientos","Añade ingresos, gastos y transferencias. Las transferencias sólo mueven dinero entre tus cuentas."],
  ["Organiza tus cuentas","Crea cuentas con su saldo inicial y consulta cuánto dinero tienes disponible en cada una."],
  ["Controla tus presupuestos","Define límites por categoría y revisa cuánto has consumido durante el mes."],
  ["Conoce tu patrimonio","Nexo calcula tus activos menos tus pasivos e incluye automáticamente los saldos de tus cuentas."],
  ["Protege tus datos","Tus datos viven en este dispositivo. Exporta respaldos periódicos desde Configuración."],
] as const;

export function AppExperience() {
  const {data,demoMode,saveProfile,setGuideCompleted}=useAppStore();
  const [name,setName]=useState("");
  const [error,setError]=useState("");
  const [step,setStep]=useState(0);
  const submit=async()=>{try{await saveProfile(name);setError("")}catch(reason){setError(reason instanceof Error?reason.message:"No se pudo guardar el nombre.")}};

  if(!data.profile&&!demoMode)return <div className="experience-backdrop"><section className="experience-dialog" role="dialog" aria-modal="true" aria-labelledby="welcome-title"><span className="eyebrow">PRIMER INICIO</span><h1 id="welcome-title">Bienvenido a Nexo</h1><p>Antes de comenzar, ¿cómo te llamas?</p><label>Nombre<Input autoFocus value={name} onChange={event=>setName(event.target.value)} maxLength={60} aria-describedby={error?"profile-error":undefined} onKeyDown={event=>{if(event.key==="Enter")void submit()}}/></label>{error&&<p id="profile-error" className="form-error" role="alert">{error}</p>}<Button className="primary-button full" onPress={submit}>Continuar</Button></section></div>;
  if(data.profile&&!data.settings.guideCompleted){const [title,copy]=steps[step];return <div className="experience-backdrop guide-backdrop"><section className="experience-dialog" role="dialog" aria-modal="true" aria-labelledby="guide-title"><span className="eyebrow">GUÍA INICIAL · {step+1} DE {steps.length}</span><h2 id="guide-title">{title}</h2><p>{copy}</p><div className="guide-progress" aria-hidden="true">{steps.map((_,index)=><i className={index<=step?"active":""} key={index}/>)}</div><div className="guide-actions"><Button className="secondary-button" onPress={()=>void setGuideCompleted(true)}>Omitir</Button>{step>0&&<Button className="secondary-button" onPress={()=>setStep(value=>value-1)}>Atrás</Button>}<Button className="primary-button" onPress={()=>step===steps.length-1?void setGuideCompleted(true):setStep(value=>value+1)}>{step===steps.length-1?"Finalizar":"Siguiente"}</Button></div></section></div>}
  return null;
}
