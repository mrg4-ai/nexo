"use client";
export default function ErrorView({reset}:{error:Error&{digest?:string};reset:()=>void}){return <section className="card empty-state" role="alert"><h1>No pudimos mostrar esta pantalla</h1><p>Tus datos locales no se eliminaron. Puedes intentar cargar la vista nuevamente.</p><button className="primary-button" type="button" onClick={reset}>Reintentar</button></section>}
