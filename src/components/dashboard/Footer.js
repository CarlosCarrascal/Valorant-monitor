import { Github, Shield } from 'lucide-react';

export default function Footer() {
    return (
        /* CAMBIO: mt-20 -> mt-10 (menos espacio arriba) */
        <footer className="mt-10 border-t border-white/10 pt-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* --- IZQUIERDA --- */}
                <div>
                    <h4 className="text-base font-black text-white tracking-widest uppercase mb-2">
                        Valorant Monitor <span className="text-[#ff4655]">2026</span>
                    </h4>
                    <p className="text-xs text-slate-500 font-mono max-w-lg leading-relaxed">
                        Este proyecto no está afiliado con Riot Games. Valorant y todas las propiedades asociadas 
                        son marcas comerciales o marcas registradas de Riot Games, Inc.
                    </p>
                </div>

                {/* --- DERECHA --- */}
                <div className="flex items-center gap-6">
                    <a href="#" className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wider">
                        <Github size={14} className="group-hover:text-[#ff4655] transition-colors" />
                        Source Code
                    </a>
                    <div className="h-4 w-[1px] bg-white/10"></div>
                    <a href="#" className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wider">
                        <Shield size={14} className="group-hover:text-[#ff4655] transition-colors" />
                        Privacy Policy
                    </a>
                </div>
            </div>
        </footer>
    );
}