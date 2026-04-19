import { motion } from 'framer-motion';
import { PAGE_TRANSITION, STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motion';

export default function PageWrapper({ children, title, subtitle }) {
    return (
        <motion.div
            variants={PAGE_TRANSITION}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full px-6 py-10 md:px-12"
        >
            <div className="max-w-[1400px] mx-auto">
                {(title || subtitle) && (
                    <motion.div 
                        variants={STAGGER_CONTAINER}
                        initial="hidden"
                        animate="show"
                        className="mb-12 relative"
                    >
                        {/* Title Bar Accent */}
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full hidden md:block" />
                        
                        {title && (
                            <motion.h1 
                                variants={STAGGER_ITEM}
                                className="text-4xl md:text-5xl font-display font-black text-white tracking-tight leading-tight"
                            >
                                {title}
                            </motion.h1>
                        )}
                        {subtitle && (
                            <motion.p 
                                variants={STAGGER_ITEM}
                                className="text-lg text-text-secondary mt-3 max-w-3xl font-medium leading-relaxed"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </motion.div>
                )}
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full"
                >
                    {children}
                </motion.div>
            </div>
        </motion.div>
    );
}
