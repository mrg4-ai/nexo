import Link from "next/link";
export default function NotFound(){return <section className="card empty-state"><h1>Página no encontrada</h1><p>La dirección no corresponde a una pantalla disponible de Nexo.</p><Link className="primary-button" href="/">Volver al inicio</Link></section>}
