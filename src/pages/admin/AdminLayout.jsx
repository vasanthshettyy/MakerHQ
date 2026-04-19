import { Outlet } from 'react-router-dom';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';

export default function AdminLayout() {
    return (
        <LayoutGroup>
            <div className="flex h-screen bg-background p-3 md:p-5 gap-3 md:gap-5 overflow-hidden font-sans selection:bg-primary/30 selection:text-white">
                <Sidebar />
                
                <motion.div 
                    layout
                    className="flex-1 flex flex-col min-w-0 gap-3 md:gap-5 relative"
                >
                    <Topbar />
                    
                    <main className="flex-1 overflow-hidden glass-card !rounded-[2rem] border-white/5 bg-surface-950/40 relative group/main">
                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.2)] z-0" />
                        
                        <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin relative z-10 p-1 md:p-2">
                            <AnimatePresence mode="wait">
                                <Outlet />
                            </AnimatePresence>
                        </div>
                    </main>
                </motion.div>
            </div>
        </LayoutGroup>
    );
}
