import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { PAGE_TRANSITION, STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motion';
import { cn } from '../../lib/utils';

export default function PageWrapper({ children, title, subtitle }) {
    const { isDark } = useTheme();

    return (
        <motion.div
            variants={PAGE_TRANSITION}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full px-6 py-8 md:px-10"
        >
            <div className="max-w-[1400px] mx-auto">
                {(title || subtitle) && (
                    <motion.div
                        variants={STAGGER_CONTAINER}
                        initial="hidden"
                        animate="show"
                        className="mb-10 relative pl-5"
                    >
                        {/* Left accent bar — matches primary brand color */}
                        <motion.div
                            variants={STAGGER_ITEM}
                            className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-gradient-to-b from-primary to-secondary"
                            style={{ boxShadow: '0 0 10px rgba(99,102,241,0.4)' }}
                        />

                        {title && (
                            <motion.h1
                                variants={STAGGER_ITEM}
                                className={cn(
                                    'text-3xl md:text-4xl font-display font-black tracking-tight leading-tight',
                                    'text-text-primary',
                                )}
                            >
                                {title}
                            </motion.h1>
                        )}

                        {subtitle && (
                            <motion.p
                                variants={STAGGER_ITEM}
                                className={cn(
                                    'text-sm md:text-base mt-2.5 max-w-2xl font-medium leading-relaxed',
                                    isDark ? 'text-text-secondary' : 'text-text-muted',
                                )}
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="w-full"
                >
                    {children}
                </motion.div>
            </div>
        </motion.div>
    );
}
